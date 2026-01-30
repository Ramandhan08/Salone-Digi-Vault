"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { BlockchainStatus } from "@/components/admin/blockchain-status"
import { useLanguage } from "@/lib/language-context"

export default function BlockchainPage() {
  const { t } = useLanguage()

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Solana Blockchain Module</h1>
          <p className="text-muted-foreground">Configure and monitor Solana blockchain integration</p>
        </div>

        <BlockchainStatus />
      </div>
    </AdminLayout>
  )
}
