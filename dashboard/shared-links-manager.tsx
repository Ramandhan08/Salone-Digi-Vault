"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link2, Trash2, Copy, Eye, Download, Clock } from "lucide-react"
import type { SharedLink, Document } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function SharedLinksManager() {
  const { toast } = useToast()
  const [sharedLinks, setSharedLinks] = useState<(SharedLink & { document?: Document })[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state
  const [selectedDocId, setSelectedDocId] = useState("")
  const [expiryHours, setExpiryHours] = useState("24")
  const [permissions, setPermissions] = useState<"view" | "download">("view")

  useEffect(() => {
    fetchSharedLinks()
    fetchDocuments()
  }, [])

  async function fetchSharedLinks() {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      const res = await fetch("/api/documents/shared", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSharedLinks(data.links)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch shared links:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDocuments() {
    const token = localStorage.getItem("auth_token")
    if (!token) return

    try {
      const res = await fetch("/api/documents/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        // Only show approved documents
        setDocuments(data.documents.filter((d: Document) => d.verificationStatus === "approved"))
      }
    } catch (error) {
      console.error("[v0] Failed to fetch documents:", error)
    }
  }

  async function createShareLink() {
    if (!selectedDocId) return

    setCreating(true)
    try {
      const token = localStorage.getItem("auth_token")
      const expiresAt = new Date(Date.now() + Number.parseInt(expiryHours) * 60 * 60 * 1000)

      const res = await fetch("/api/documents/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: selectedDocId,
          expiresAt,
          permissions,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast({
          title: "Share link created",
          description: "Your document share link is ready to use",
        })
        setDialogOpen(false)
        fetchSharedLinks()
      }
    } catch (error) {
      console.error("[v0] Failed to create share link:", error)
      toast({
        title: "Error",
        description: "Failed to create share link",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  async function deleteShareLink(linkId: string) {
    const token = localStorage.getItem("auth_token")

    try {
      const res = await fetch(`/api/documents/shared/${linkId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        toast({
          title: "Link deleted",
          description: "Share link has been revoked",
        })
        fetchSharedLinks()
      }
    } catch (error) {
      console.error("[v0] Failed to delete share link:", error)
    }
  }

  function copyShareLink(token: string) {
    const url = `${window.location.origin}/shared/${token}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Share Links</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Link2 className="w-4 h-4 mr-2" />
                  Create Share Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Share Link</DialogTitle>
                  <DialogDescription>Share a document with temporary access link</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">Document</Label>
                    <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                      <SelectTrigger id="document">
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent>
                        {documents.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.fileName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Time</Label>
                    <Select value={expiryHours} onValueChange={setExpiryHours}>
                      <SelectTrigger id="expiry">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="72">3 days</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select value={permissions} onValueChange={(v) => setPermissions(v as "view" | "download")}>
                      <SelectTrigger id="permissions">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="download">View & Download</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={createShareLink} className="w-full" disabled={creating || !selectedDocId}>
                    {creating ? "Creating..." : "Create Link"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {sharedLinks.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No active share links</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sharedLinks.map((link) => {
                const isExpired = new Date(link.expiresAt) < new Date()
                return (
                  <div key={link.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{link.document?.fileName || "Unknown"}</h4>
                        {isExpired && <Badge variant="destructive">Expired</Badge>}
                        <Badge variant="outline">
                          {link.permissions === "view" ? (
                            <Eye className="w-3 h-3 mr-1" />
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          {link.permissions}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {isExpired
                            ? "Expired"
                            : `Expires ${formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}`}
                        </span>
                        <span>{link.accessCount} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyShareLink(link.token)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteShareLink(link.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
