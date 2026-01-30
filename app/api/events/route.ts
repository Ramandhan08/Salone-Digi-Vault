import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAuth, requireAdminOrOfficer, getAuthToken } from "@/lib/auth"
import type { EventStatus, EventType } from "@/lib/types"

// GET /api/events - List all events with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status") as EventStatus | null
        const type = searchParams.get("type") as EventType | null
        const location = searchParams.get("location")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")

        let events = await db.getAllEvents()

        // Apply filters
        if (status) {
            events = events.filter((e) => e.status === status)
        }
        if (type) {
            events = events.filter((e) => e.eventType === type)
        }
        if (location) {
            events = events.filter((e) => e.location.toLowerCase().includes(location.toLowerCase()))
        }
        if (startDate) {
            events = events.filter((e) => new Date(e.startDate) >= new Date(startDate))
        }
        if (endDate) {
            events = events.filter((e) => new Date(e.endDate) <= new Date(endDate))
        }

        return NextResponse.json({ success: true, events })
    } catch (error) {
        console.error("[Events] Error fetching events:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}

// POST /api/events - Create new event (admin/officer only)
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const user = await requireAdminOrOfficer(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const eventData = await request.json()

        // Validate required fields
        const requiredFields = ["title", "description", "eventType", "location", "startDate", "endDate", "capacity"]
        for (const field of requiredFields) {
            if (!eventData[field]) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
            }
        }

        // Validate dates
        const startDate = new Date(eventData.startDate)
        const endDate = new Date(eventData.endDate)
        if (startDate >= endDate) {
            return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
        }

        // Default QR code settings
        const qrCodeSettings = eventData.qrCodeSettings || {
            errorCorrectionLevel: "H",
            colorDark: "#000000",
            colorLight: "#FFFFFF",
            includeEventInfo: true,
        }

        const event = await db.createEvent({
            title: eventData.title,
            description: eventData.description,
            eventType: eventData.eventType,
            location: eventData.location,
            startDate,
            endDate,
            capacity: parseInt(eventData.capacity),
            currentAttendees: 0,
            status: eventData.status || "draft",
            organizerId: user.id,
            organizerName: user.name,
            imageUrl: eventData.imageUrl,
            qrCodeSettings,
        })

        // Create audit log
        await db.createAuditLog({
            userId: user.id,
            action: "event_created",
            details: { eventId: event.id, title: event.title },
        })

        console.log("[Events] Event created:", event.id)

        return NextResponse.json({ success: true, event })
    } catch (error) {
        console.error("[Events] Error creating event:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
