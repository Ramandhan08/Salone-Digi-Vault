"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, Shield } from "lucide-react"
import type { Document } from "@/lib/types"
import { format } from "date-fns"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  birth_certificate: "Birth Certificate",
  national_id: "National ID",
  passport: "Passport",
  property_deed: "Property Deed",
  school_certificate: "School Certificate",
  tax_paper: "Tax Paper",
  other: "Other",
}

export function AdminDocumentReview({ documentId }: { documentId: string }) {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  useEffect(() => {
    async function fetchDocument() {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const res = await fetch(`/api/documents/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setDocument(data.document)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch document:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  async function handleApprove() {
    if (!document) return
    setProcessing(true)

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: document.id,
          action: "approve",
        }),
      })

      if (res.ok) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("[v0] Approve error:", error)
    } finally {
      setProcessing(false)
    }
  }

  async function handleReject() {
    if (!document || !rejectionReason.trim()) return
    setProcessing(true)

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: document.id,
          action: "reject",
          reason: rejectionReason,
        }),
      })

      if (res.ok) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("[v0] Reject error:", error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Document Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{DOCUMENT_TYPE_LABELS[document.documentType]}</h1>
                <p className="text-muted-foreground">{document.fileName}</p>
                <p className="text-sm text-muted-foreground">Uploaded {format(new Date(document.uploadedAt), "PPp")}</p>
              </div>
            </div>
            <Badge variant="secondary">{document.verificationStatus.replace("_", " ")}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {document.metadata && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tamper Detection Alerts */}
            {document.metadata.tamperFlags && document.metadata.tamperFlags.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Alerts</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1">
                    {document.metadata.tamperFlags.map((flag, idx) => (
                      <li key={idx}>• {flag}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold">Tamper Score: {document.metadata.tamperScore?.toFixed(1)}%</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Face Matching Result */}
            {document.metadata.faceMatchScore !== undefined && (
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Face Match Verification</span>
                  <Badge variant={document.metadata.faceMatchSuccess ? "default" : "destructive"}>
                    {document.metadata.faceMatchSuccess ? "Passed" : "Failed"}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${document.metadata.faceMatchSuccess ? "bg-green-600" : "bg-red-600"}`}
                    style={{ width: `${document.metadata.faceMatchScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Match Score: {document.metadata.faceMatchScore.toFixed(1)}%
                </p>
              </div>
            )}

            {/* Extracted Data */}
            {document.metadata.extractedData && (
              <div>
                <h4 className="font-semibold mb-3">Extracted Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(document.metadata.extractedData).map(([key, value]) => (
                    <div key={key} className="p-3 border border-border rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OCR Text */}
            {document.metadata.ocrText && (
              <div>
                <h4 className="font-semibold mb-2">OCR Extracted Text</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{document.metadata.ocrText}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decision Actions */}
      {document.verificationStatus !== "approved" && document.verificationStatus !== "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showRejectForm ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Rejection Reason</Label>
                  <Textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a clear reason for rejection..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleReject} variant="destructive" disabled={processing || !rejectionReason.trim()}>
                    {processing ? "Processing..." : "Confirm Rejection"}
                  </Button>
                  <Button onClick={() => setShowRejectForm(false)} variant="outline" disabled={processing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleApprove} size="lg" className="flex-1" disabled={processing}>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Document
                </Button>
                <Button
                  onClick={() => setShowRejectForm(true)}
                  size="lg"
                  variant="destructive"
                  className="flex-1"
                  disabled={processing}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blockchain Info */}
      {document.blockchainHash && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Document Hash</p>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">{document.fileHash}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Blockchain Hash</p>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">{document.blockchainHash}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
