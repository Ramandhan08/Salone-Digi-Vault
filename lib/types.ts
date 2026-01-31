// Document Types
export type DocumentType =
  | "birth_certificate"
  | "national_id"
  | "passport"
  | "drivers_license"
  | "property_deed"
  | "school_certificate"
  | "tax_paper"
  | "other"

// Verification Status
export type VerificationStatus = "submitted" | "under_review" | "approved" | "rejected"

// User Role
export type UserRole = "citizen" | "officer" | "admin"

// User Interface
export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: UserRole
  passwordHash?: string
  facePhotoUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Document Interface
export interface Document {
  id: string
  userId: string
  documentType: DocumentType
  fileName: string
  fileUrl: string
  fileSize: number
  fileHash: string
  uploadedAt: Date
  verificationStatus: VerificationStatus
  verifiedBy?: string
  verifiedAt?: Date
  rejectionReason?: string
  blockchainHash?: string
  blockchainTxHash?: string
  metadata?: DocumentMetadata
}

// Document Metadata from AI Processing
export interface DocumentMetadata {
  ocrText?: string
  extractedData?: Record<string, any>
  documentTypeDetected?: DocumentType
  faceMatchScore?: number
  faceMatchSuccess?: boolean
  tamperScore?: number
  tamperFlags?: string[]
  processingDate: Date
  registryVerified?: boolean
  registryDetails?: string
  blockchain?: {
    network: string
    txHash: string
    blockNumber: number
    timestamp?: Date
  }
}

// AI Processing Result
export interface AIProcessingResult {
  success: boolean
  ocrText?: string
  extractedData?: Record<string, any>
  faceMatchScore?: number
  faceMatchSuccess?: boolean
  tamperScore?: number
  tamperFlags?: string[]
  documentType?: DocumentType
  error?: string
}

// Audit Log
export interface AuditLog {
  id: string
  userId: string
  action: string
  details: Record<string, any>
  ipAddress?: string
  timestamp: Date
}

// Shared Link
export interface SharedLink {
  id: string
  documentId: string
  userId: string
  token: string
  expiresAt: Date
  accessCount: number
  createdAt: Date
  permissions: "view" | "download"
}

// Notification
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

// Event Management Types
export type EventStatus = "draft" | "published" | "ongoing" | "completed" | "cancelled"
export type EventType = "conference" | "workshop" | "seminar" | "webinar" | "meetup" | "other"
export type AttendeeStatus = "registered" | "checked_in" | "checked_out" | "cancelled"

export interface Event {
  id: string
  title: string
  description: string
  eventType: EventType
  location: string
  startDate: Date
  endDate: Date
  capacity: number
  currentAttendees: number
  status: EventStatus
  organizerId: string
  organizerName: string
  imageUrl?: string
  qrCodeSettings: QRCodeSettings
  createdAt: Date
  updatedAt: Date
}

export interface QRCodeSettings {
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  colorDark: string
  colorLight: string
  logoUrl?: string
  includeEventInfo: boolean
}

export interface EventRegistration {
  id: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  registrationNumber: string
  qrCode: string
  status: AttendeeStatus
  checkInTime?: Date
  checkOutTime?: Date
  registeredAt: Date
}

export interface EventWaitlist {
  id: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  position: number
  notified: boolean
  expiresAt?: Date
  createdAt: Date
}

export interface EventFeedback {
  id: string
  eventId: string
  userId: string
  userName: string
  overallRating: number
  speakerRating?: number
  venueRating?: number
  organizationRating?: number
  comments?: string
  createdAt: Date
}

export interface EmailTemplate {
  id: string
  name: string
  category: "registration" | "reminder" | "thank_you" | "check_in" | "check_out" | "waitlist" | "custom"
  subject: string
  body: string
  variables: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface EmailLog {
  id: string
  recipientEmail: string
  recipientName: string
  subject: string
  body: string
  templateId?: string
  eventId?: string
  status: "sent" | "failed" | "pending"
  sentAt?: Date
  error?: string
}

// OTP Verification
export interface OTPVerification {
  id: string
  email: string
  code: string
  purpose: "signup" | "login" | "password_reset"
  expiresAt: Date
  verified: boolean
  createdAt: Date
}

// AI Analytics for Events
export interface EventAnalytics {
  eventId: string
  totalRegistrations: number
  totalAttendance: number
  checkInRate: number
  averageRating?: number
  peakAttendanceTime?: Date
  attendanceByHour: Record<string, number>
  feedbackSummary?: {
    averageOverall: number
    averageSpeaker?: number
    averageVenue?: number
    averageOrganization?: number
    totalFeedbacks: number
  }
  predictions?: {
    expectedAttendance: number
    successScore: number
    recommendations: string[]
  }
}

