"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { FileCheck, Clock, CheckCircle, XCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function DashboardStats() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("auth_token")
      if (!token) return

      try {
        const res = await fetch("/api/documents/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      label: t("totalDocuments"),
      value: stats.total,
      icon: FileCheck,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      label: t("pending"),
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      label: t("verified"),
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      label: t("rejected"),
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
