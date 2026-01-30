"use client"

import { useEffect } from "react"

export function AppPurposeStore() {
  useEffect(() => {
    const info = {
      name: "Salone Digital Vault",
      purpose:
        "Government-grade digital document management with AI verification and Solana blockchain-backed integrity for Sierra Leone citizens.",
      features: [
        "Secure storage and encryption",
        "AI OCR and identity verification",
        "Officer approval workflow",
        "Solana blockchain registration and verification",
        "Event registration and QR-based check-in/out",
      ],
    }
    try {
      localStorage.setItem("sdv_app_info", JSON.stringify(info))
    } catch {}
  }, [])
  return null
}
