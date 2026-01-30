import type { AIProcessingResult, DocumentType } from "./types"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const extractedDataSchema = z.object({
  documentType: z.enum([
    "national_id",
    "passport",
    "birth_certificate",
    "drivers_license",
    "property_deed",
    "school_certificate",
    "tax_paper",
    "other",
  ]),
  name: z.string().optional(),
  dateOfBirth: z.string().optional(),
  documentNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  issuingAuthority: z.string().optional(),
  allText: z.string(),
})

const tamperDetectionSchema = z.object({
  tamperScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Score from 0-100 indicating likelihood of tampering (higher = more suspicious)"),
  flags: z.array(z.string()).describe("Specific issues detected in the document"),
  analysis: z.string().describe("Detailed analysis of document authenticity"),
})

export const AIService = {
  // OCR Extraction with AI
  async extractOCR(fileData: string, fileName: string): Promise<{ text: string; extractedData: Record<string, any> }> {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: extractedDataSchema,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all information from this document. Identify the document type and extract key fields like name, dates, document numbers, etc. Return all text content in the 'allText' field.",
              },
              {
                type: "file",
                data: fileData,
                mediaType: "application/pdf",
                filename: fileName,
              },
            ],
          },
        ],
      })

      return {
        text: object.allText,
        extractedData: {
          documentType: object.documentType,
          name: object.name,
          dateOfBirth: object.dateOfBirth,
          documentNumber: object.documentNumber,
          issueDate: object.issueDate,
          expiryDate: object.expiryDate,
          nationality: object.nationality,
          address: object.address,
          issuingAuthority: object.issuingAuthority,
        },
      }
    } catch (error) {
      console.error("[v0] OCR extraction error:", error)
      throw new Error("Failed to extract document data")
    }
  },

  // Document Type Detection
  async detectDocumentType(fileData: string, fileName: string): Promise<DocumentType> {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: z.object({
          documentType: z.enum([
            "national_id",
            "passport",
            "birth_certificate",
            "drivers_license",
            "property_deed",
            "school_certificate",
            "tax_paper",
            "other",
          ]),
          confidence: z.number().min(0).max(100),
        }),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the type of this government document. Choose the most appropriate category.",
              },
              {
                type: "file",
                data: fileData,
                mediaType: "application/pdf",
                filename: fileName,
              },
            ],
          },
        ],
      })

      return object.documentType as DocumentType
    } catch (error) {
      console.error("[v0] Document type detection error:", error)
      return "other"
    }
  },

  // Tamper Detection with AI
  async detectTampering(fileData: string, fileName: string): Promise<{ score: number; flags: string[] }> {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: tamperDetectionSchema,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this document for signs of tampering, forgery, or manipulation. Look for: inconsistent fonts, edited text, alignment issues, quality inconsistencies, suspicious patterns, altered dates or numbers, and any other signs of fraud.",
              },
              {
                type: "file",
                data: fileData,
                mediaType: "application/pdf",
                filename: fileName,
              },
            ],
          },
        ],
      })

      return {
        score: object.tamperScore,
        flags: object.flags,
      }
    } catch (error) {
      console.error("[v0] Tamper detection error:", error)
      return {
        score: 0,
        flags: ["Unable to perform tamper detection"],
      }
    }
  },

  // Face Verification (placeholder - requires specialized model)
  async verifyFace(documentImage: string, userSelfie?: string): Promise<{ matchScore: number; success: boolean }> {
    // Note: Face verification requires specialized models
    // This is a placeholder that returns mock data
    await new Promise((resolve) => setTimeout(resolve, 500))

    const matchScore = Math.random() * 40 + 60 // 60-100
    return {
      matchScore,
      success: matchScore > 75,
    }
  },

  // Full document processing
  async processDocument(
    fileData: string,
    fileName: string,
    documentType: DocumentType,
    userSelfie?: string,
  ): Promise<AIProcessingResult> {
    try {
      console.log("[v0] Starting comprehensive AI document processing...")

      const [ocrResult, tamperResult, detectedType] = await Promise.all([
        this.extractOCR(fileData, fileName),
        this.detectTampering(fileData, fileName),
        this.detectDocumentType(fileData, fileName),
      ])

      console.log("[v0] AI extraction completed:", {
        detectedType,
        tamperScore: tamperResult.score,
        extractedFields: Object.keys(ocrResult.extractedData).length,
      })

      let faceResult = null
      if (
        userSelfie &&
        (documentType === "national_id" ||
          documentType === "passport" ||
          detectedType === "national_id" ||
          detectedType === "passport")
      ) {
        console.log("[v0] Performing face verification...")
        faceResult = await this.verifyFace(fileData, userSelfie)
      }

      const contentValidation = this.validateDocumentContent(ocrResult.extractedData, detectedType)

      console.log("[v0] AI processing completed successfully with", contentValidation.validFields, "valid fields")

      return {
        success: true,
        ocrText: ocrResult.text,
        extractedData: {
          ...ocrResult.extractedData,
          contentValidation,
        },
        documentType: detectedType,
        tamperScore: tamperResult.score,
        tamperFlags: tamperResult.flags,
        faceMatchScore: faceResult?.matchScore,
        faceMatchSuccess: faceResult?.success,
      }
    } catch (error) {
      console.error("[v0] AI processing error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "AI processing failed",
      }
    }
  },

  validateDocumentContent(
    extractedData: Record<string, any>,
    documentType: DocumentType,
  ): { validFields: number; totalFields: number; missingFields: string[]; warnings: string[] } {
    const requiredFields: Record<DocumentType, string[]> = {
      national_id: ["name", "documentNumber", "dateOfBirth", "nationality"],
      passport: ["name", "documentNumber", "dateOfBirth", "nationality", "expiryDate"],
      birth_certificate: ["name", "dateOfBirth", "issuingAuthority"],
      drivers_license: ["name", "documentNumber", "expiryDate"],
      property_deed: ["address", "documentNumber", "issuingAuthority"],
      school_certificate: ["name", "issuingAuthority", "issueDate"],
      tax_paper: ["name", "documentNumber", "issueDate"],
      other: [],
    }

    const required = requiredFields[documentType] || []
    const missingFields: string[] = []
    const warnings: string[] = []
    let validFields = 0

    for (const field of required) {
      if (extractedData[field]) {
        validFields++
      } else {
        missingFields.push(field)
      }
    }

    // Check for expiry dates
    if (extractedData.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate)
      if (expiryDate < new Date()) {
        warnings.push("Document appears to be expired")
      }
    }

    // Check for issue dates
    if (extractedData.issueDate) {
      const issueDate = new Date(extractedData.issueDate)
      if (issueDate > new Date()) {
        warnings.push("Issue date is in the future")
      }
    }

    return {
      validFields,
      totalFields: required.length,
      missingFields,
      warnings,
    }
  },

  // Cross-reference with mock government registries
  async crossReferenceRegistry(
    documentType: DocumentType,
    extractedData: Record<string, any>,
  ): Promise<{ verified: boolean; registryName: string; details: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const registries = {
      birth_certificate: "National Birth Registry",
      national_id: "National ID Database",
      passport: "Immigration Database",
      drivers_license: "Transport Authority",
      property_deed: "Land Registry",
      school_certificate: "Education Board",
      tax_paper: "Tax Authority Database",
      fileData: "Pdf, ppt, doc,",
      other: "General Registry",
    }

    const verified = Math.random() > 0.2 // 80% verification rate

    return {
      verified,
      registryName: registries[documentType],
      details: verified ? "Document found in registry and details match" : "No matching record found in registry",
    }
  },
}
