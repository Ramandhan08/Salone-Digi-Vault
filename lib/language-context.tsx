"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "krio"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Common
    welcome: "Welcome",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    submit: "Submit",
    search: "Search",

    // Navigation
    dashboard: "Dashboard",
    myDocuments: "My Documents",
    upload: "Upload",
    profile: "Profile",
    logout: "Logout",
    settings: "Settings",

    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",

    // Dashboard
    totalDocuments: "Total Documents",
    verified: "Verified",
    pending: "Pending",
    rejected: "Rejected",
    recentDocuments: "Recent Documents",
    uploadDocument: "Upload Document",

    // Document Types
    nationalID: "National ID",
    passport: "Passport",
    driverLicense: "Driver's License",
    birthCertificate: "Birth Certificate",
    degreeCertificate: "Degree Certificate",
    other: "Other",

    // Document Status
    pendingVerification: "Pending Verification",
    verifiedDocument: "Verified",
    rejectedDocument: "Rejected",

    // Profile
    profileSettings: "Profile Settings",
    personalInformation: "Personal Information",
    updateProfile: "Update Profile",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",

    // Blockchain
    blockchainVerified: "Blockchain Verified",
    verifyOnBlockchain: "Verify on Blockchain",
    transactionHash: "Transaction Hash",
    blockNumber: "Block Number",

    // Theme
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Language
    language: "Language",
    english: "English",
    krio: "Krio",
  },
  krio: {
    // Common
    welcome: "Welkɔm",
    loading: "Di tin de lod...",
    save: "Kip am",
    cancel: "Kansul",
    delete: "Dilit",
    edit: "Chenj",
    close: "Kloz",
    submit: "Sɔbmit",
    search: "Fɛn",

    // Navigation
    dashboard: "Dashbɔd",
    myDocuments: "Mi Dɔkyumɛnt dɛn",
    upload: "Oplod",
    profile: "Profayl",
    logout: "Kɔmɔt",
    settings: "Sɛtin dɛn",

    // Auth
    login: "Log In",
    signup: "Sayn Ɔp",
    email: "Imel",
    password: "Paswɔd",
    confirmPassword: "Kɔnfam Paswɔd",
    fullName: "Ful Nem",
    phoneNumber: "Fon Nɔmba",
    dontHaveAccount: "Yu nɔ gɛt akawnt?",
    alreadyHaveAccount: "Yu dɔn gɛt akawnt?",

    // Dashboard
    totalDocuments: "Ɔl Dɔkyumɛnt dɛn",
    verified: "Dɛn dɔn verify",
    pending: "I de wet",
    rejected: "Dɛn dɔn ripul am",
    recentDocuments: "Nyu Dɔkyumɛnt dɛn",
    uploadDocument: "Oplod Dɔkyumɛnt",

    // Document Types
    nationalID: "Nashɔnal Kadɛ",
    passport: "Paspɔt",
    driverLicense: "Drayva Laysin",
    birthCertificate: "Bot Satifiket",
    degreeCertificate: "Digri Satifiket",
    other: "Ɔda tin",

    // Document Status
    pendingVerification: "I de wet fɔ verify",
    verifiedDocument: "Dɛn dɔn verify",
    rejectedDocument: "Dɛn dɔn ripul",

    // Profile
    profileSettings: "Profayl Sɛtin dɛn",
    personalInformation: "Pɛsin In Infɔmeshɔn",
    updateProfile: "Ɔpdet Profayl",
    changePassword: "Chenj Paswɔd",
    currentPassword: "Di Paswɔd we yu de yuz naw",
    newPassword: "Nyu Paswɔd",

    // Blockchain
    blockchainVerified: "Blɔkchen dɔn verify",
    verifyOnBlockchain: "Verify na Blɔkchen",
    transactionHash: "Transakshɔn Hash",
    blockNumber: "Blɔk Nɔmba",

    // Theme
    theme: "Taym",
    light: "Layt",
    dark: "Dak",
    system: "Sistɛm",

    // Language
    language: "Langwej",
    english: "Inglish",
    krio: "Krio",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "krio")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
