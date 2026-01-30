"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileCheck, ArrowUpRight, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-muted-foreground">Monitor system performance and manage platform resources.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/events/create">Create New Event</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/scanner">Open QR Scanner</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 happening right now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground text-orange-600">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Event Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    TS
                  </div>
                  <div>
                    <p className="font-medium">Tech Summit 2024</p>
                    <p className="text-sm text-muted-foreground">Registration spike detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">+145</p>
                  <p className="text-xs text-muted-foreground">New Registrations</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    WS
                  </div>
                  <div>
                    <p className="font-medium">Web3 Workshop</p>
                    <p className="text-sm text-muted-foreground">Event completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">98%</p>
                  <p className="text-xs text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="secondary" className="justify-start">
              <Users className="mr-2 h-4 w-4" /> Verify User Identity
            </Button>
            <Button variant="secondary" className="justify-start">
              <FileCheck className="mr-2 h-4 w-4" /> Review Documents
            </Button>
            <Button variant="secondary" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" /> Manage Event Capacity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
