"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, FileText, AlertTriangle, CheckCircle, Shield } from "lucide-react"
import type { Document } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const STATUS_CONFIG = {
  submitted: { label: "Submitted", color: "text-blue-600 bg-blue-100 dark:bg-blue-900" },
  under_review: { label: "Under Review", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900" },
  approved: { label: "Approved", color: "text-green-600 bg-green-100 dark:bg-green-900" },
  rejected: { label: "Rejected", color: "text-red-600 bg-red-100 dark:bg-red-900" },
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  birth_certificate: "Birth Certificate",
  national_id: "National ID",
  passport: "Passport",
  property_deed: "Property Deed",
  school_certificate: "School Certificate",
  tax_paper: "Tax Paper",
  other: "Other",
}

export function DocumentDetails({ documentId }: { documentId: string }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

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

  const statusConfig = STATUS_CONFIG[document.verificationStatus]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vault
          </Link>
        </Button>
      </div>

      {/* Document Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{DOCUMENT_TYPE_LABELS[document.documentType]}</h1>
                <p className="text-muted-foreground">{document.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              {document.blockchainHash && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Shield className="w-3 h-3" />
                  Blockchain Verified
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Results */}
      {document.metadata && (
        <Card>
          <CardHeader>
            <CardTitle>AI Verification Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tamper Detection */}
            {document.metadata.tamperFlags && document.metadata.tamperFlags.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Tamper Alerts Detected</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1">
                    {document.metadata.tamperFlags.map((flag, idx) => (
                      <li key={idx}>• {flag}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Face Matching */}
            {document.metadata.faceMatchScore !== undefined && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Face Match Score</span>
                  <span
                    className={
                      document.metadata.faceMatchSuccess
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {document.metadata.faceMatchScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${document.metadata.faceMatchSuccess ? "bg-green-600" : "bg-red-600"}`}
                    style={{ width: `${document.metadata.faceMatchScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {document.metadata.extractedData && (
              <div>
                <h4 className="font-semibold mb-3">Extracted Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(document.metadata.extractedData).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted rounded-lg">
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

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Document Uploaded</p>
                <p className="text-sm text-muted-foreground">{format(new Date(document.uploadedAt), "PPpp")}</p>
              </div>
            </div>

            {document.metadata && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">AI Processing Complete</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(document.metadata.processingDate), "PPpp")}
                  </p>
                </div>
              </div>
            )}

            {document.verificationStatus === "approved" && document.verifiedAt && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Approved by Government Officer</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(document.verifiedAt), "PPpp")}</p>
                </div>
              </div>
            )}

            {document.verificationStatus === "under_review" && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Pending Officer Review</p>
                  <p className="text-sm text-muted-foreground">Awaiting government verification</p>
                </div>
              </div>
            )}

            {document.verificationStatus === "rejected" && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Document Rejected</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{document.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Info */}
      {document.blockchainHash && (
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Verification</CardTitle>
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
            {document.blockchainTxHash && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-sm bg-muted p-2 rounded break-all">{document.blockchainTxHash}</p>
              </div>
            )}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This document's hash has been recorded on the blockchain, ensuring permanent verification of its
                authenticity.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
