"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void
    onScanError?: (error: any) => void
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    useEffect(() => {
        // Only initialize on client side
        if (typeof window !== "undefined") {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
        /* verbose= */ false
            )

            scannerRef.current.render(
                (decodedText) => {
                    setScanResult(decodedText)
                    onScanSuccess(decodedText)
                    // Optional: pause or stop scanning after success
                    scannerRef.current?.clear()
                },
                (error) => {
                    if (onScanError) onScanError(error)
                }
            )
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner.", error)
                })
            }
        }
    }, [onScanSuccess, onScanError])

    const handleReset = () => {
        setScanResult(null)
        window.location.reload() // Simple way to restart the scanner for now
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {!scanResult ? (
                <div className="overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-black">
                    <div id="reader" className="w-full h-full min-h-[300px]" />
                    <p className="text-center text-sm text-muted-foreground p-2">
                        Point camera at QR code
                    </p>
                </div>
            ) : (
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Scan Successful!</h3>
                    <p className="text-sm text-muted-foreground break-all mb-6">{scanResult}</p>
                    <Button onClick={handleReset} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> Scan Another
                    </Button>
                </div>
            )}
        </div>
    )
}
