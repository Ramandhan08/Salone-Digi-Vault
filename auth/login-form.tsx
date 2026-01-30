"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useLogin } from "@privy-io/react-auth"

export function LoginForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mode, setMode] = useState<"password" | "privy">("password")
  const { login: privyLogin } = useLogin()

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const ct = res.headers.get("content-type") || ""
      const data = ct.includes("application/json") ? await res.json() : await res.text()
      if (!res.ok) {
        throw new Error((data && (data as any).error) || (typeof data === "string" ? data : "Login failed"))
      }
      localStorage.setItem("auth_token", (data as any).token)
      const role = (data as any).user?.role
      if (role === "admin" || role === "officer") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  async function sendLoginCode() {
    setError("")
    setSuccess("")
    try {
      await privyLogin({ loginMethods: ["email"] })
      setSuccess("Verification email sent via Privy")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Privy code send failed")
    }
  }

  

  async function handlePrivyLogin() {
    setError("")
    setSuccess("")
    try {
      await privyLogin({ loginMethods: ["email"] })
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message || "Privy login failed")
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-card-foreground">{t("login")}</h2>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mt-2">
          <Button type="button" variant={mode === "password" ? "default" : "outline"} onClick={() => setMode("password")}>
            Password
          </Button>
          <Button type="button" variant={mode === "privy" ? "default" : "outline"} onClick={() => setMode("privy")}>
            Privy
          </Button>
        </div>
        <form onSubmit={handlePasswordLogin} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {mode === "password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t("login")}
              </Button>
              <Button type="button" variant="outline" className="w-full" disabled={loading || !email} onClick={sendLoginCode}>
                Send Verification Code
              </Button>
            </>
          )}
          {mode === "privy" && (
            <Button type="button" className="w-full" disabled={loading} onClick={handlePrivyLogin}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue with Privy
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-center text-muted-foreground">
          {t("dontHaveAccount")}{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            {t("signup")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
