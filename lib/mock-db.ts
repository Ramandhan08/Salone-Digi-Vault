import type {
  User,
  Document,
  AuditLog,
  SharedLink,
  Notification,
  Event,
  EventRegistration,
  EventWaitlist,
  EventFeedback,
  EmailTemplate,
  EmailLog,
  OTPVerification,
} from "./types"

// In-memory mock database
export const mockDB = {
  users: [] as User[],
  documents: [] as Document[],
  auditLogs: [] as AuditLog[],
  sharedLinks: [] as SharedLink[],
  notifications: [] as Notification[],
  events: [] as Event[],
  eventRegistrations: [] as EventRegistration[],
  eventWaitlists: [] as EventWaitlist[],
  eventFeedbacks: [] as EventFeedback[],
  emailTemplates: [] as EmailTemplate[],
  emailLogs: [] as EmailLog[],
  otpVerifications: [] as OTPVerification[],
}


// Helper functions for mock database operations
export const db = {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    return mockDB.users.find((u) => u.id === id)
  },

  async getUserById(id: string): Promise<User | undefined> {
    return mockDB.users.find((u) => u.id === id)
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return mockDB.users.find((u) => u.email === email)
  },

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDB.users.push(newUser)
    return newUser
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const index = mockDB.users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    mockDB.users[index] = { ...mockDB.users[index], ...updates, updatedAt: new Date() }
    return mockDB.users[index]
  },

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    return mockDB.documents.find((d) => d.id === id)
  },

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return mockDB.documents.filter((d) => d.userId === userId)
  },

  async getAllDocuments(): Promise<Document[]> {
    return mockDB.documents
  },

  async createDocument(doc: Omit<Document, "id">): Promise<Document> {
    const newDoc: Document = {
      ...doc,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    mockDB.documents.push(newDoc)
    return newDoc
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const index = mockDB.documents.findIndex((d) => d.id === id)
    if (index === -1) return undefined
    mockDB.documents[index] = { ...mockDB.documents[index], ...updates }
    return mockDB.documents[index]
  },

  async deleteDocument(id: string): Promise<boolean> {
    const index = mockDB.documents.findIndex((d) => d.id === id)
    if (index === -1) return false
    mockDB.documents.splice(index, 1)
    return true
  },

  // Audit Logs
  async createAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    mockDB.auditLogs.push(newLog)
    return newLog
  },

  async getAuditLogs(userId?: string): Promise<AuditLog[]> {
    if (userId) {
      return mockDB.auditLogs.filter((l) => l.userId === userId)
    }
    return mockDB.auditLogs
  },

  // Shared Links
  async createSharedLink(link: Omit<SharedLink, "id" | "createdAt" | "accessCount">): Promise<SharedLink> {
    const newLink: SharedLink = {
      ...link,
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accessCount: 0,
      createdAt: new Date(),
    }
    mockDB.sharedLinks.push(newLink)
    return newLink
  },

  async getSharedLink(token: string): Promise<SharedLink | undefined> {
    return mockDB.sharedLinks.find((l) => l.token === token)
  },

  async getSharedLinksByUser(userId: string): Promise<SharedLink[]> {
    return mockDB.sharedLinks.filter((l) => l.userId === userId)
  },

  async deleteSharedLink(id: string): Promise<boolean> {
    const index = mockDB.sharedLinks.findIndex((l) => l.id === id)
    if (index === -1) return false
    mockDB.sharedLinks.splice(index, 1)
    return true
  },

  // Notifications
  async createNotification(notif: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    mockDB.notifications.push(newNotif)
    return newNotif
  },

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return mockDB.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const notif = mockDB.notifications.find((n) => n.id === id)
    if (!notif) return false
    notif.read = true
    return true
  },

  // Events
  async createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDB.events.push(newEvent)
    return newEvent
  },

  async getEvent(id: string): Promise<Event | undefined> {
    return mockDB.events.find((e) => e.id === id)
  },

  async getAllEvents(): Promise<Event[]> {
    return mockDB.events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return mockDB.events.filter((e) => e.organizerId === organizerId)
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const index = mockDB.events.findIndex((e) => e.id === id)
    if (index === -1) return undefined
    mockDB.events[index] = { ...mockDB.events[index], ...updates, updatedAt: new Date() }
    return mockDB.events[index]
  },

  async deleteEvent(id: string): Promise<boolean> {
    const index = mockDB.events.findIndex((e) => e.id === id)
    if (index === -1) return false
    mockDB.events.splice(index, 1)
    return true
  },

  // Event Registrations
  async createEventRegistration(
    registration: Omit<EventRegistration, "id" | "registeredAt">
  ): Promise<EventRegistration> {
    const newRegistration: EventRegistration = {
      ...registration,
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registeredAt: new Date(),
    }
    mockDB.eventRegistrations.push(newRegistration)
    return newRegistration
  },

  async getEventRegistration(id: string): Promise<EventRegistration | undefined> {
    return mockDB.eventRegistrations.find((r) => r.id === id)
  },

  async getEventRegistrationByNumber(registrationNumber: string): Promise<EventRegistration | undefined> {
    return mockDB.eventRegistrations.find((r) => r.registrationNumber === registrationNumber)
  },

  async getEventRegistrationsByEvent(eventId: string): Promise<EventRegistration[]> {
    return mockDB.eventRegistrations.filter((r) => r.eventId === eventId)
  },

  async getEventRegistrationsByUser(userId: string): Promise<EventRegistration[]> {
    return mockDB.eventRegistrations.filter((r) => r.userId === userId)
  },

  async updateEventRegistration(
    id: string,
    updates: Partial<EventRegistration>
  ): Promise<EventRegistration | undefined> {
    const index = mockDB.eventRegistrations.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    mockDB.eventRegistrations[index] = { ...mockDB.eventRegistrations[index], ...updates }
    return mockDB.eventRegistrations[index]
  },

  async deleteEventRegistration(id: string): Promise<boolean> {
    const index = mockDB.eventRegistrations.findIndex((r) => r.id === id)
    if (index === -1) return false
    mockDB.eventRegistrations.splice(index, 1)
    return true
  },

  // Event Waitlist
  async createWaitlistEntry(entry: Omit<EventWaitlist, "id" | "createdAt">): Promise<EventWaitlist> {
    const newEntry: EventWaitlist = {
      ...entry,
      id: `wait_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    mockDB.eventWaitlists.push(newEntry)
    return newEntry
  },

  async getWaitlistByEvent(eventId: string): Promise<EventWaitlist[]> {
    return mockDB.eventWaitlists
      .filter((w) => w.eventId === eventId)
      .sort((a, b) => a.position - b.position)
  },

  async getWaitlistByUser(userId: string): Promise<EventWaitlist[]> {
    return mockDB.eventWaitlists.filter((w) => w.userId === userId)
  },

  async updateWaitlistEntry(id: string, updates: Partial<EventWaitlist>): Promise<EventWaitlist | undefined> {
    const index = mockDB.eventWaitlists.findIndex((w) => w.id === id)
    if (index === -1) return undefined
    mockDB.eventWaitlists[index] = { ...mockDB.eventWaitlists[index], ...updates }
    return mockDB.eventWaitlists[index]
  },

  async deleteWaitlistEntry(id: string): Promise<boolean> {
    const index = mockDB.eventWaitlists.findIndex((w) => w.id === id)
    if (index === -1) return false
    mockDB.eventWaitlists.splice(index, 1)
    return true
  },

  // Event Feedback
  async createEventFeedback(feedback: Omit<EventFeedback, "id" | "createdAt">): Promise<EventFeedback> {
    const newFeedback: EventFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    mockDB.eventFeedbacks.push(newFeedback)
    return newFeedback
  },

  async getFeedbackByEvent(eventId: string): Promise<EventFeedback[]> {
    return mockDB.eventFeedbacks.filter((f) => f.eventId === eventId)
  },

  async getFeedbackByUser(userId: string): Promise<EventFeedback[]> {
    return mockDB.eventFeedbacks.filter((f) => f.userId === userId)
  },

  // Email Templates
  async createEmailTemplate(template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDB.emailTemplates.push(newTemplate)
    return newTemplate
  },

  async getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
    return mockDB.emailTemplates.find((t) => t.id === id)
  },

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return mockDB.emailTemplates
  },

  async getEmailTemplatesByCategory(category: EmailTemplate["category"]): Promise<EmailTemplate[]> {
    return mockDB.emailTemplates.filter((t) => t.category === category)
  },

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const index = mockDB.emailTemplates.findIndex((t) => t.id === id)
    if (index === -1) return undefined
    mockDB.emailTemplates[index] = { ...mockDB.emailTemplates[index], ...updates, updatedAt: new Date() }
    return mockDB.emailTemplates[index]
  },

  async deleteEmailTemplate(id: string): Promise<boolean> {
    const index = mockDB.emailTemplates.findIndex((t) => t.id === id)
    if (index === -1) return false
    mockDB.emailTemplates.splice(index, 1)
    return true
  },

  // Email Logs
  async createEmailLog(log: Omit<EmailLog, "id">): Promise<EmailLog> {
    const newLog: EmailLog = {
      ...log,
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    mockDB.emailLogs.push(newLog)
    return newLog
  },

  async getEmailLogs(): Promise<EmailLog[]> {
    return mockDB.emailLogs.sort((a, b) => {
      if (!a.sentAt || !b.sentAt) return 0
      return b.sentAt.getTime() - a.sentAt.getTime()
    })
  },

  // OTP Verification
  async createOTP(otp: Omit<OTPVerification, "id" | "createdAt">): Promise<OTPVerification> {
    const newOTP: OTPVerification = {
      ...otp,
      id: `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    mockDB.otpVerifications.push(newOTP)
    return newOTP
  },

  async getOTP(email: string, code: string): Promise<OTPVerification | undefined> {
    return mockDB.otpVerifications.find((o) => o.email === email && o.code === code && !o.verified)
  },

  async verifyOTP(id: string): Promise<boolean> {
    const otp = mockDB.otpVerifications.find((o) => o.id === id)
    if (!otp) return false
    otp.verified = true
    return true
  },

  async cleanupExpiredOTPs(): Promise<void> {
    const now = new Date()
    mockDB.otpVerifications = mockDB.otpVerifications.filter((o) => o.expiresAt > now || o.verified)
  },
}


// Seed initial super admin user
const seedSuperAdmin = async () => {
  if (process.env.NODE_ENV === "production") return
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
  if (!superAdminEmail || !superAdminPassword) return
  const existingAdmin = await db.getUserByEmail(superAdminEmail)
  if (existingAdmin) return
  const { hashPassword } = await import("./auth")
  const passwordHash = await hashPassword(superAdminPassword)
  await db.createUser({
    email: superAdminEmail,
    name: "Super Administrator",
    role: "admin",
    phone: "",
    passwordHash,
  })
  console.log("Super Admin account seeded")
}

seedSuperAdmin()
