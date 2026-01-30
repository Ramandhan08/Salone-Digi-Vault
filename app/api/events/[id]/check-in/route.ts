import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAdminOrOfficer, getAuthToken } from "@/lib/auth"
import { sendEventEmail, processTemplate, defaultTemplates } from "@/lib/email-service"

// POST /api/events/[id]/check-in - Check-in attendee (admin/officer only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const officer = await requireAdminOrOfficer(token)

        if (!officer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { registrationNumber, qrData } = await request.json()

        if (!registrationNumber && !qrData) {
            return NextResponse.json({ error: "Registration number or QR data required" }, { status: 400 })
        }

        // Determine registration number from input
        let targetRegistrationNumber = registrationNumber
        if (qrData) {
            try {
                const parsed = JSON.parse(qrData)
                if (parsed.registrationNumber) {
                    targetRegistrationNumber = parsed.registrationNumber
                }
                // Verify event ID matches if present in QR
                if (parsed.eventId && parsed.eventId !== params.id) {
                    return NextResponse.json({ error: "QR code belongs to a different event" }, { status: 400 })
                }
            } catch {
                // If not JSON, assume raw registration number string
                targetRegistrationNumber = qrData
            }
        }

        const registration = await db.getEventRegistrationByNumber(targetRegistrationNumber)

        if (!registration) {
            return NextResponse.json({ error: "Invalid registration number" }, { status: 404 })
        }

        if (registration.eventId !== params.id) {
            return NextResponse.json({ error: "Registration does not match this event" }, { status: 400 })
        }

        if (registration.status === "checked_in") {
            return NextResponse.json({
                error: "Attendee already checked in",
                registration,
                alreadyCheckedIn: true
            }, { status: 400 })
        }

        if (registration.status === "cancelled") {
            return NextResponse.json({ error: "Registration is cancelled" }, { status: 400 })
        }

        // Update status
        await db.updateEventRegistration(registration.id, {
            status: "checked_in",
            checkInTime: new Date(),
        })

        const event = await db.getEvent(params.id)

        // Log the check-in
        console.log(`[CheckEnd] User ${registration.userId} checked in to event ${params.id} by ${officer.id}`)

        // Optional: Send welcome email (uncomment if desired)
        /*
        if (event) {
          // Send email logic here
        }
        */

        return NextResponse.json({
            success: true,
            message: "Check-in successful",
            attendee: {
                name: registration.userName,
                email: registration.userEmail,
                status: "checked_in",
                checkInTime: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error("[CheckIn] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
