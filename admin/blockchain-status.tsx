"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import { PhantomWalletButton } from "@/components/ui/phantom-wallet-button"

interface BlockchainStatus {
  enabled: boolean
  network: string
  rpcUrl: string
  ready: boolean
  message: string
}

export function BlockchainStatus() {
  const [status, setStatus] = useState<BlockchainStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/blockchain/solana/status")
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch blockchain status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
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

  if (!status) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Solana Blockchain Configuration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={status.enabled ? "default" : "secondary"}>{status.enabled ? "Active" : "Disabled"}</Badge>
              <PhantomWalletButton />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="font-semibold">{status.enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Network</p>
              <p className="font-semibold capitalize">{status.network}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">RPC URL</p>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">{status.rpcUrl}</p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Phantom Wallet Integration</AlertTitle>
            <AlertDescription>
              Connect your Phantom wallet to enable real-time document verification on the Solana blockchain. Without a
              wallet connection, the system operates in mock mode with simulated blockchain transactions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {status.enabled && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Solana Blockchain Active</AlertTitle>
          <AlertDescription>
            Document hashes are being registered on Solana {status.network}. All approved documents receive permanent
            blockchain verification for authenticity.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How Solana Integration Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Document Hash Generation</h4>
              <p className="text-muted-foreground">
                When a document is uploaded, a SHA-256 hash is generated from the file contents. This hash uniquely
                identifies the document and serves as its digital fingerprint.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Solana Blockchain Registration</h4>
              <p className="text-muted-foreground">
                Upon officer approval, the document hash is registered on the Solana blockchain with user ID and
                timestamp. Solana's high-speed, low-cost transactions make it ideal for government-scale document
                verification.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Phantom Wallet Connection</h4>
              <p className="text-muted-foreground">
                Officers can connect their Phantom wallet to sign and submit real blockchain transactions. The wallet
                integration ensures secure, verifiable document registration on Solana's network.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Integrity Verification</h4>
              <p className="text-muted-foreground">
                Anyone can verify document authenticity by recomputing the hash and checking it against the Solana
                blockchain. Any tampering will cause hash mismatch, making document forgery impossible.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5. Permanent Immutable Record</h4>
              <p className="text-muted-foreground">
                Once registered on Solana, the document verification record is permanent and cannot be altered or
                deleted. This ensures long-term authenticity and creates an auditable trail for all government
                documents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">Current Settings:</p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>
                  <span className="text-muted-foreground">NEXT_PUBLIC_SOLANA_NETWORK:</span> {status.network}
                </p>
                <p>
                  <span className="text-muted-foreground">NEXT_PUBLIC_SOLANA_RPC_URL:</span> {status.rpcUrl}
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  {status.enabled ? "✓ Operational" : "⚠ Requires Configuration"}
                </p>
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To activate full Solana integration, ensure the following environment variables are set:
                NEXT_PUBLIC_SOLANA_NETWORK (mainnet-beta, devnet, testnet), NEXT_PUBLIC_SOLANA_RPC_URL, and
                NEXT_PUBLIC_SOLANA_PROGRAM_ID.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
