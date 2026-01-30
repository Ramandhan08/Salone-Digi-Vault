import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIProcessingLoader } from "./AIProcessingLoader"

export function ScanPreview({
  imageData,
  onSaved,
}: {
  imageData: string
  onSaved: (res: any) => void
}) {
  const [displayName, setDisplayName] = useState("Scanned Document")
  const [accessLevel, setAccessLevel] = useState<"private" | "government">("private")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function saveToVault() {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("auth_token")
      if (!token) throw new Error("Not authenticated")

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          documentType: "other",
          fileName: `${displayName}.jpg`,
          fileData: imageData,
          fileSize: Math.round((imageData.length * 3) / 4),
          metadata: { accessLevel, displayName },
        }),
      })

      const ct = res.headers.get("content-type") || ""
      const body = ct.includes("application/json") ? await res.json() : await res.text()
      if (!res.ok) throw new Error((body && body.error) || "Failed to save document")
      onSaved(body)
    } catch (e: any) {
      setError(e.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AIProcessingLoader label="Saving to Digi Vault..." />
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="rounded-lg overflow-hidden border">
          <img src={imageData} alt="Scanned document" className="w-full h-auto" />
        </div>
        <div className="space-y-2">
          <Label>Document Name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Access</Label>
          <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="government">Government-accessible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-full" onClick={saveToVault}>
          Save to Digi Vault
        </Button>
      </CardContent>
    </Card>
  )
}
