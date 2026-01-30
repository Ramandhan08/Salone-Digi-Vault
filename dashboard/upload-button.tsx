import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"

export function UploadButton() {
  return (
    <Button asChild>
      <Link href="/dashboard/upload">
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Link>
    </Button>
  )
}
