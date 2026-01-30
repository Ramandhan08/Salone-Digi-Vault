"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PhantomProvider {
  isPhantom?: boolean
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  disconnect: () => Promise<void>
  publicKey: { toString: () => string } | null
}

declare global {
  interface Window {
    solana?: PhantomProvider
  }
}

export function PhantomWalletButton() {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [phantom, setPhantom] = useState<PhantomProvider | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && window.solana?.isPhantom) {
      setPhantom(window.solana)

      // Check if already connected
      if (window.solana.publicKey) {
        setConnected(true)
        setPublicKey(window.solana.publicKey.toString())
      }
    }
  }, [])

  const connectWallet = async () => {
    if (!phantom) {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom wallet extension",
        variant: "destructive",
      })
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      const response = await phantom.connect()
      const pubKey = response.publicKey.toString()
      setConnected(true)
      setPublicKey(pubKey)

      // Store in localStorage for persistence
      localStorage.setItem("phantom_wallet", pubKey)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${pubKey.substring(0, 8)}...`,
      })
    } catch (error) {
      console.error("[v0] Phantom wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = async () => {
    if (!phantom) return

    try {
      await phantom.disconnect()
      setConnected(false)
      setPublicKey(null)
      localStorage.removeItem("phantom_wallet")

      toast({
        title: "Wallet Disconnected",
        description: "Phantom wallet has been disconnected",
      })
    } catch (error) {
      console.error("[v0] Phantom wallet disconnect error:", error)
    }
  }

  if (!phantom) {
    return (
      <Button variant="outline" size="sm" onClick={connectWallet}>
        <Wallet className="w-4 h-4 mr-2" />
        Install Phantom
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <Button variant="outline" size="sm" onClick={disconnectWallet}>
        <Wallet className="w-4 h-4 mr-2" />
        {publicKey.substring(0, 4)}...{publicKey.substring(publicKey.length - 4)}
      </Button>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={connectWallet}>
      <Wallet className="w-4 h-4 mr-2" />
      Connect Phantom
    </Button>
  )
}
