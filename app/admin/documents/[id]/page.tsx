import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDocumentReview } from "@/components/admin/admin-document-review"

export default function AdminDocumentPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <AdminDocumentReview documentId={params.id} />
    </AdminLayout>
  )
}
