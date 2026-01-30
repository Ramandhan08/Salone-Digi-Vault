import QRCode from "qrcode"
import type { QRCodeSettings } from "./types"

// Generate QR code with custom settings
export async function generateQRCode(
    data: string,
    settings?: Partial<QRCodeSettings>
): Promise<string> {
    const defaultSettings: QRCodeSettings = {
        errorCorrectionLevel: "H",
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        includeEventInfo: false,
    }

    const finalSettings = { ...defaultSettings, ...settings }

    try {
        const qrCodeDataURL = await QRCode.toDataURL(data, {
            errorCorrectionLevel: finalSettings.errorCorrectionLevel,
            color: {
                dark: finalSettings.colorDark,
                light: finalSettings.colorLight,
            },
            width: 400,
            margin: 2,
        })

        return qrCodeDataURL
    } catch (error) {
        console.error("Error generating QR code:", error)
        throw new Error("Failed to generate QR code")
    }
}

// Generate event registration QR code
export async function generateEventQRCode(
    registrationNumber: string,
    eventId: string,
    settings?: Partial<QRCodeSettings>
): Promise<string> {
    const qrData = JSON.stringify({
        type: "event_registration",
        registrationNumber,
        eventId,
        timestamp: new Date().toISOString(),
    })

    return generateQRCode(qrData, settings)
}

// Generate document verification QR code
export async function generateDocumentQRCode(
    documentId: string,
    documentHash: string
): Promise<string> {
    const qrData = JSON.stringify({
        type: "document_verification",
        documentId,
        hash: documentHash,
        timestamp: new Date().toISOString(),
    })

    return generateQRCode(qrData, {
        errorCorrectionLevel: "H",
        colorDark: "#1e40af",
        colorLight: "#ffffff",
    })
}

// Verify QR code data
export function verifyQRCodeData(qrData: string): {
    valid: boolean
    type?: string
    data?: any
    error?: string
} {
    try {
        const parsed = JSON.parse(qrData)

        if (!parsed.type) {
            return { valid: false, error: "Invalid QR code format: missing type" }
        }

        return { valid: true, type: parsed.type, data: parsed }
    } catch (error) {
        return { valid: false, error: "Invalid QR code data" }
    }
}

// Generate registration number
export function generateRegistrationNumber(eventId: string): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const eventPrefix = eventId.substring(0, 4).toUpperCase()

    return `${eventPrefix}-${timestamp}-${random}`
}

// Generate QR code with logo overlay (advanced)
export async function generateBrandedQRCode(
    data: string,
    settings: QRCodeSettings & { logoDataURL?: string }
): Promise<string> {
    try {
        // Generate base QR code
        const baseQR = await QRCode.toDataURL(data, {
            errorCorrectionLevel: settings.errorCorrectionLevel,
            color: {
                dark: settings.colorDark,
                light: settings.colorLight,
            },
            width: 500,
            margin: 2,
        })

        // If no logo, return base QR
        if (!settings.logoDataURL && !settings.logoUrl) {
            return baseQR
        }

        // In a real implementation, you would use canvas to overlay the logo
        // For now, return the base QR code
        // TODO: Implement canvas-based logo overlay
        return baseQR
    } catch (error) {
        console.error("Error generating branded QR code:", error)
        throw new Error("Failed to generate branded QR code")
    }
}

// Parse scanned QR code
export interface ScannedQRData {
documentname: "text"
    type: "event_registration" | "document_verification" | "unknown"
    registrationNumber?: string
    eventId?: string
    documentId?: string
    hash?: string
    timestamp?: string
}

export function parseScannedQR(qrString: string): ScannedQRData | null {
    try {
        const data = JSON.parse(qrString)
        return data as ScannedQRData
    } catch {
        // If not JSON, might be a simple registration number
        return {
            type: "unknown",
            registrationNumber: qrString,
        }
    }
}
