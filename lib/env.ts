import { z } from "zod"

const ServerEnvSchema = z.object({
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  PRIVY_SECRET_KEY: z.string().optional(),
  PRIVY_API_SECRET: z.string().optional(),
  // Optional: Mobile MCP/Expo configuration
  NEXT_PUBLIC_PRIVY_MCP_URL: z.string().optional(),
  PRIVY_EXPO_APP_ID: z.string().optional(),
  PRIVY_EXPO_SECRET: z.string().optional(),
  // Optional: Dev base URL for server-side fetches
  NEXT_PUBLIC_DEV_URL: z.string().optional(),
  // Optional: Infrastructure
  DATABASE_URL: z.string().optional(),
  SOLANA_RPC_URL: z.string().optional(),
  SOLANA_PROGRAM_ID: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // Email / OTP
  SMTP_EMAIL: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_ENABLED: z.string().optional(),
})

export const envServer = (() => {
  const parsed = ServerEnvSchema.parse(process.env)
  return {
    NEXT_PUBLIC_PRIVY_APP_ID: parsed.NEXT_PUBLIC_PRIVY_APP_ID,
    JWT_SECRET: parsed.JWT_SECRET,
    PRIVY_SECRET_KEY: parsed.PRIVY_SECRET_KEY || parsed.PRIVY_API_SECRET,
    NEXT_PUBLIC_PRIVY_MCP_URL: parsed.NEXT_PUBLIC_PRIVY_MCP_URL,
    PRIVY_EXPO_APP_ID: parsed.PRIVY_EXPO_APP_ID,
    PRIVY_EXPO_SECRET: parsed.PRIVY_EXPO_SECRET,
    NEXT_PUBLIC_DEV_URL: parsed.NEXT_PUBLIC_DEV_URL,
    SUPABASE_URL: (parsed as any).SUPABASE_URL || (process.env.Supabase_URL as string) || "",
    SUPABASE_ANON_KEY:
      (parsed as any).SUPABASE_ANON_KEY || (process.env.Supabase_Publishable_Key as string) || "",
    SUPABASE_BUCKET: (process.env.SUPABASE_BUCKET as string) || "documents",
    DATABASE_URL: parsed.DATABASE_URL,
    SOLANA_RPC_URL: parsed.SOLANA_RPC_URL,
    SOLANA_PROGRAM_ID: parsed.SOLANA_PROGRAM_ID,
    CLOUDINARY_API_KEY: parsed.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: parsed.CLOUDINARY_API_SECRET,
    SMTP_EMAIL: parsed.SMTP_EMAIL || parsed.SMTP_USER,
    SMTP_PASSWORD: parsed.SMTP_PASSWORD,
    SMTP_ENABLED: parsed.SMTP_ENABLED,
  }
})()
