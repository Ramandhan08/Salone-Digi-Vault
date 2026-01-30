"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, AlertTriangle } from "lucide-react"
import type { Document } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  birth_certificate: "Birth Certificate",
  national_id: "National ID",
  passport: "Passport",
  property_deed: "Property Deed",
  school_certificate: "School Certificate",
  tax_paper: "Tax Paper",
  other: "Other",
}

export function PendingDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const res = await fetch("/api/admin/documents", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setDocuments(data.documents)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

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
    <Card>
      <CardHeader>
        <CardTitle>Documents Pending Review</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No documents pending review</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{DOCUMENT_TYPE_LABELS[doc.documentType]}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                      {doc.metadata?.tamperFlags && doc.metadata.tamperFlags.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{doc.metadata.tamperFlags.length} flags</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{doc.verificationStatus.replace("_", " ")}</Badge>
                  <Button size="sm" asChild>
                    <Link href={`/admin/documents/${doc.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
