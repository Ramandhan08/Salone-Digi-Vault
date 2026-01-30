"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Share2, MoreVertical, Eye } from "lucide-react"
import type { Document } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const STATUS_CONFIG = {
  submitted: { label: "Submitted", variant: "secondary" as const, color: "text-blue-600" },
  under_review: { label: "Under Review", variant: "default" as const, color: "text-yellow-600" },
  approved: { label: "Approved", variant: "default" as const, color: "text-green-600" },
  rejected: { label: "Rejected", variant: "destructive" as const, color: "text-red-600" },
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

export function DocumentsGrid() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const res = await fetch("/api/documents/list", {
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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2 text-foreground">No documents yet</h3>
        <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
        <Button asChild>
          <Link href="/dashboard/upload">Upload Document</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => {
        const statusConfig = STATUS_CONFIG[doc.verificationStatus]
        return (
          <Card key={doc.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{DOCUMENT_TYPE_LABELS[doc.documentType]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                {doc.blockchainHash && <Badge variant="outline">Blockchain Verified</Badge>}
              </div>

              <p className="text-sm text-muted-foreground truncate">{doc.fileName}</p>

              {doc.rejectionReason && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{doc.rejectionReason}</p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <Link href={`/dashboard/documents/${doc.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
