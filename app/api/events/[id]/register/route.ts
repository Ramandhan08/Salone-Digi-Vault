import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAuth, getAuthToken } from "@/lib/auth"
import { generateEventQRCode, generateRegistrationNumber } from "@/lib/qr-service"
import { sendEventEmail, processTemplate, defaultTemplates } from "@/lib/email-service"
import { format } from "date-fns"

// POST /api/events/[id]/register - Register for event
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const user = await requireAuth(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const event = await db.getEvent(params.id)
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        // Check if event is published
        if (event.status !== "published") {
            return NextResponse.json({ error: "Event is not open for registration" }, { status: 400 })
        }

        // Check if already registered
        const existingRegistrations = await db.getEventRegistrationsByEvent(params.id)
        const alreadyRegistered = existingRegistrations.find((r) => r.userId === user.id)
        if (alreadyRegistered) {
            return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 })
        }

        // Check capacity
        if (existingRegistrations.length >= event.capacity) {
            // Add to waitlist
            const waitlist = await db.getWaitlistByEvent(params.id)
            const position = waitlist.length + 1

            await db.createWaitlistEntry({
                eventId: params.id,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                position,
                notified: false,
            })

            return NextResponse.json({
                success: false,
                waitlisted: true,
                message: "Event is full. You have been added to the waitlist.",
                position,
            })
        }

        // Generate registration number and QR code
        const registrationNumber = generateRegistrationNumber(params.id)
        const qrCode = await generateEventQRCode(registrationNumber, params.id, event.qrCodeSettings)

        // Create registration
        const registration = await db.createEventRegistration({
            eventId: params.id,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            registrationNumber,
            qrCode,
            status: "registered",
        })

        // Update event attendee count
        await db.updateEvent(params.id, {
            currentAttendees: existingRegistrations.length + 1,
        })

        // Send confirmation email
        const emailVariables = {
            userName: user.name,
            eventName: event.title,
            registrationNumber,
            eventDate: format(new Date(event.startDate), "MMMM dd, yyyy 'at' hh:mm a"),
            eventLocation: event.location,
            year: new Date().getFullYear().toString(),
        }

        const emailBody = processTemplate(defaultTemplates.registration.body, emailVariables)
        const emailSubject = processTemplate(defaultTemplates.registration.subject, emailVariables)

        await sendEventEmail(user.email, emailSubject, emailBody, [
            {
                filename: "qr-code.png",
                content: qrCode.split(",")[1], // Remove data:image/png;base64, prefix
                encoding: "base64",
            },
        ])

        // Create notification
        await db.createNotification({
            userId: user.id,
            title: "Event Registration Confirmed",
            message: `You have successfully registered for ${event.title}. Your registration number is ${registrationNumber}.`,
            type: "success",
            read: false,
        })

        // Create audit log
        await db.createAuditLog({
            userId: user.id,
            action: "event_registration",
            details: { eventId: params.id, registrationNumber },
        })

        console.log("[Events] User registered:", user.id, "for event:", params.id)

        return NextResponse.json({
            success: true,
            registration: {
                id: registration.id,
                registrationNumber,
                qrCode,
                event: {
                    id: event.id,
                    title: event.title,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    location: event.location,
                },
            },
        })
    } catch (error) {
        console.error("[Events] Error registering for event:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}

// GET /api/events/[id]/register - Get user's registration for this event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const user = await requireAuth(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const registrations = await db.getEventRegistrationsByEvent(params.id)
        const userRegistration = registrations.find((r) => r.userId === user.id)

        if (!userRegistration) {
            // Check if on waitlist
            const waitlist = await db.getWaitlistByEvent(params.id)
            const waitlistEntry = waitlist.find((w) => w.userId === user.id)

            if (waitlistEntry) {
                return NextResponse.json({
                    success: true,
                    registered: false,
                    waitlisted: true,
                    position: waitlistEntry.position,
                })
            }

            return NextResponse.json({
                success: true,
                registered: false,
                waitlisted: false,
            })
        }

        return NextResponse.json({
            success: true,
            registered: true,
            registration: userRegistration,
        })
    } catch (error) {
        console.error("[Events] Error fetching registration:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/events/[id]/register - Cancel registration
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const user = await requireAuth(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const registrations = await db.getEventRegistrationsByEvent(params.id)
        const userRegistration = registrations.find((r) => r.userId === user.id)

        if (!userRegistration) {
            return NextResponse.json({ error: "Registration not found" }, { status: 404 })
        }

        // Cancel registration
        await db.updateEventRegistration(userRegistration.id, {
            status: "cancelled"
        })

        const event = await db.getEvent(params.id)
        if (!event) {
            return NextResponse.json({ success: true, message: "Registration cancelled" })
        }

        // Update attendee count (decrement)
        if (event.currentAttendees > 0) {
            await db.updateEvent(event.id, {
                currentAttendees: event.currentAttendees - 1
            })
        }

        // Check Waitlist & Notify first person
        const waitlist = await db.getWaitlistByEvent(params.id)
        // Get non-notified, valid entries
        const nextInLine = waitlist.find(w => !w.notified && (!w.expiresAt || w.expiresAt > new Date()))

        if (nextInLine) {
            // Notify them
            const emailVariables = {
                userName: nextInLine.userName,
                eventName: event.title,
                registrationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}/register?from_waitlist=true`,
                eventDate: format(new Date(event.startDate), "MMMM dd, yyyy"),
                eventLocation: event.location,
                expiryHours: "24",
                year: new Date().getFullYear().toString(),
            }

            const emailBody = processTemplate(defaultTemplates.waitlist.body, emailVariables)
            const emailSubject = processTemplate(defaultTemplates.waitlist.subject, emailVariables)

            // Mark as notified and set expiry
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            await db.updateWaitlistEntry(nextInLine.id, {
                notified: true,
                expiresAt
            })

            await sendEventEmail(nextInLine.userEmail, emailSubject, emailBody)

            console.log(`[Waitlist] Notified user ${nextInLine.userId} for event ${event.id}`)
        }

        return NextResponse.json({ success: true, message: "Registration cancelled. Waitlist processed." })

    } catch (error) {
        console.error("[CancelReg] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}

