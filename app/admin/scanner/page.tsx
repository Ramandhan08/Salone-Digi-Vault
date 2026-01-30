"use client"

import { useState } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const [manualCode, setManualCode] = useState("")

    const handleScan = async (data: string) => {
        setLoading(true)
        try {
            // Parse QR if JSON
            let payload = { qrData: data }

            // TODO: Get Event ID dynamically or selected from dropdown
            // For now, let's assume we scan, then identify event, or default to a demo event
            const eventId = "evt_1" // Demo ID

            const response = await fetch(`/api/events/${eventId}/check-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin_token' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()
            setScanResult(result)

            if (result.success) {
                toast({
                    title: "Check-in Successful",
                    description: `Welcome ${result.attendee.name}!`,
                    variant: "default", // Using default/success variant
                })
            } else {
                toast({
                    title: "Check-in Failed",
                    description: result.error,
                    variant: "destructive",
                })
            }

        } catch (error) {
            console.error("Scan error", error)
            toast({
                title: "Error",
                description: "Failed to process scan.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleManualSubmit = async () => {
        if (!manualCode) return
        handleScan(manualCode)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Event Entry Scanner</h2>
                <p className="text-muted-foreground">Scan attendee QR codes or enter registration numbers manually.</p>
            </div>

            <Tabs defaultValue="scan" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="scan">Camera Scan</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="scan">
                    <Card>
                        <CardContent className="pt-6">
                            <QRScanner onScanSuccess={handleScan} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manual">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manual Check-in</CardTitle>
                            <CardDescription>Enter the registration number (e.g., TECH-2024-001)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Registration Number"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                />
                                <Button onClick={handleManualSubmit} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check In"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Result Display */}
            {scanResult && (
                <Card className={scanResult.success ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            {scanResult.success ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                                <XCircle className="h-6 w-6 text-red-600" />
                            )}
                            <CardTitle>{scanResult.success ? "Access Granted" : "Access Denied"}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {scanResult.success ? (
                            <div className="space-y-2">
                                <p className="text-lg font-bold">{scanResult.attendee.name}</p>
                                <p className="text-sm text-muted-foreground">{scanResult.attendee.email}</p>
                                <Badge className="bg-green-600">CHECKED IN</Badge>
                                <p className="text-xs text-muted-foreground mt-2">Time: {new Date(scanResult.attendee.checkInTime).toLocaleTimeString()}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-semibold text-red-700">{scanResult.error}</p>
                                {scanResult.registration && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        <p>Attendee: {scanResult.registration.userName}</p>
                                        <p>Status: {scanResult.registration.status}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
