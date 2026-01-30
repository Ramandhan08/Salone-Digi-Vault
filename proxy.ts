import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto") || "http"
  const host = request.headers.get("host") || ""
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")

  if (proto !== "https" && !isLocal) {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/:path*"],
}
