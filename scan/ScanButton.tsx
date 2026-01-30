import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Camera } from "lucide-react"

export function ScanButton() {
  return (
    <Link href="/scan">
      <Card className="p-5 text-center">
        <div className="mx-auto h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <Camera className="h-5 w-5" />
        </div>
        <p className="mt-2 text-sm">Scan Document</p>
      </Card>
    </Link>
  )
}
