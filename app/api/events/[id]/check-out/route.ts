import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAdminOrOfficer, getAuthToken } from "@/lib/auth"
import { sendEventEmail, processTemplate, defaultTemplates } from "@/lib/email-service"

// POST /api/events/[id]/check-out - Check-out attendee (admin/officer only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const officer = await requireAdminOrOfficer(token)

        if (!officer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { registrationNumber, qrData } = await request.json()

        // Determine registration number (logic similar to check-in)
        let targetRegistrationNumber = registrationNumber
        if (qrData) {
            try {
                const parsed = JSON.parse(qrData)
                if (parsed.registrationNumber) targetRegistrationNumber = parsed.registrationNumber
            } catch {
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

        if (registration.status !== "checked_in") {
            return NextResponse.json({ error: "Attendee is not checked in" }, { status: 400 })
        }

        // Update status
        await db.updateEventRegistration(registration.id, {
            status: "checked_out",
            checkOutTime: new Date(),
        })

        const event = await db.getEvent(params.id)

        // Send Thank You email automatically
        if (event) {
            const emailVariables = {
                userName: registration.userName,
                eventName: event.title,
                feedbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${event.id}/feedback`,
                year: new Date().getFullYear().toString(),
            }

            const emailBody = processTemplate(defaultTemplates.thank_you.body, emailVariables)
            const emailSubject = processTemplate(defaultTemplates.thank_you.subject, emailVariables)

            // Send asynchronously
            sendEventEmail(registration.userEmail, emailSubject, emailBody).catch(console.error)
        }

        return NextResponse.json({
            success: true,
            message: "Check-out successful",
            attendee: {
                name: registration.userName,
                status: "checked_out",
                checkOutTime: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error("[CheckOut] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
