import type { User, UserRole } from "./types"
import { db } from "./mock-db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { envServer } from "./env"

const JWT_SECRET = envServer.JWT_SECRET
const JWT_EXPIRES_IN = "7d" // 7 days

// JWT token generation
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded
  } catch {
    return null
  }
}

// Password hashing with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Session management (stored in memory for simplicity, use Redis in production)
const sessions = new Map<string, { userId: string; expiresAt: Date }>()

export function createSession(userId: string, email: string): string {
  const token = generateToken(userId, email)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  sessions.set(token, { userId, expiresAt })
  return token
}

export function getSession(token: string): { userId: string } | null {
  const session = sessions.get(token)
  if (!session) {
    // Try to verify JWT token
    const decoded = verifyToken(token)
    if (decoded) {
      return { userId: decoded.userId }
    }
    return null
  }

  if (session.expiresAt < new Date()) {
    sessions.delete(token)
    return null
  }

  return { userId: session.userId }
}

export function deleteSession(token: string): void {
  sessions.delete(token)
}

// Authorization helpers
export async function requireAuth(token: string | undefined): Promise<User | null> {
  if (!token) return null
  const session = getSession(token)
  if (!session) return null
  return (await db.getUser(session.userId)) || null
}

export async function requireRole(token: string | undefined, role: UserRole): Promise<User | null> {
  const user = await requireAuth(token)
  if (!user || user.role !== role) return null
  return user
}

export async function requireAdminOrOfficer(token: string | undefined): Promise<User | null> {
  const user = await requireAuth(token)
  if (!user || (user.role !== "admin" && user.role !== "officer")) return null
  return user
}

export async function requireAdmin(token: string | undefined): Promise<User | null> {
  const user = await requireAuth(token)
  if (!user || user.role !== "admin") return null
  return user
}

// Get user from request headers
export function getAuthToken(authHeader: string | null): string | undefined {
  if (!authHeader) return undefined
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return authHeader
}
