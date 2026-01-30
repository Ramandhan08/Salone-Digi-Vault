"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Shield, AlertCircle } from "lucide-react"
import type { Document } from "@/lib/types"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SharedDocumentView({ token }: { token: string }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [canDownload, setCanDownload] = useState(false)

  useEffect(() => {
    async function fetchSharedDocument() {
      try {
        const res = await fetch(`/api/shared/${token}`)

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Failed to load document")
          return
        }

        const data = await res.json()
        setDocument(data.document)
        setCanDownload(data.permissions === "download")
      } catch (error) {
        console.error("[v0] Failed to fetch shared document:", error)
        setError("Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    fetchSharedDocument()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-bold mb-2 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">{error || "This link is invalid or has expired"}</p>
          </CardContent>
        </Card>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-foreground">National Document Vault</h1>
          </div>
          <p className="text-sm text-muted-foreground">Secure Document Sharing</p>
        </div>

        {/* Document Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{DOCUMENT_TYPE_LABELS[document.documentType]}</CardTitle>
                  <p className="text-muted-foreground">{document.fileName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uploaded {format(new Date(document.uploadedAt), "PPP")}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Document Verified</AlertTitle>
              <AlertDescription>
                This document has been verified by government authorities and is blockchain secured for authenticity.
              </AlertDescription>
            </Alert>

            {document.metadata?.extractedData && (
              <div>
                <h4 className="font-semibold mb-3">Document Information</h4>
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

            {document.blockchainHash && (
              <div>
                <h4 className="font-semibold mb-2">Blockchain Verification</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Document Hash</p>
                  <p className="font-mono text-xs break-all">{document.fileHash}</p>
                </div>
              </div>
            )}

            {canDownload && (
              <Button className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Document
              </Button>
            )}

            {!canDownload && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>View-only access. Downloads are not permitted for this link.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Shared via National Document Vault</p>
          <p>This link provides temporary access to a verified government document</p>
        </div>
      </div>
    </div>
  )
}
