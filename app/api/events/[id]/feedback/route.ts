import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAuth, getAuthToken } from "@/lib/auth"

// POST /api/events/[id]/feedback - Submit feedback
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const user = await requireAuth(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const { overallRating, speakerRating, venueRating, organizationRating, comments } = await request.json()

        if (!overallRating) {
            return NextResponse.json({ error: "Overall rating is required" }, { status: 400 })
        }

        // Check if user attended (must be checked_out or checked_in)
        const registrations = await db.getEventRegistrationsByEvent(id)
        const userRegistration = registrations.find(r => r.userId === user.id)

        if (!userRegistration) {
            return NextResponse.json({ error: "You are not registered for this event" }, { status: 403 })
        }

        // Check if duplicate feedback
        const existingFeedback = await db.getFeedbackByUser(user.id)
        const duplicate = existingFeedback.find(f => f.eventId === id)
        if (duplicate) {
            return NextResponse.json({ error: "You have already submitted feedback for this event" }, { status: 400 })
        }

        const feedback = await db.createEventFeedback({
            eventId: id,
            userId: user.id,
            userName: user.name,
            overallRating,
            speakerRating,
            venueRating,
            organizationRating,
            comments,
        })

        console.log(`[Feedback] User ${user.id} submitted feedback for event ${id}`)

        return NextResponse.json({ success: true, feedback })

    } catch (error) {
        console.error("[Feedback] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}

// GET /api/events/[id]/feedback - Get feedback (admin only or user's own?)
// Usually public aggregated, or admin full details. Let's do Admin full details.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // ... Implementation for admin to view feedback
    // Simulating aggregation for now or raw list
    // Let's implement getting all feedback for event
    return NextResponse.json({ message: "Not implemented yet" })
}
