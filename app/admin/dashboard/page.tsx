import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { Search, Calendar, User, Phone, Mail, Clock, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AppointmentActions } from "@/components/admin/appointment-actions"
import { SignOutButton } from "@/components/admin/sign-out-button"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const appointments = await prisma.appointment.findMany({
  include: {
    doctor: true,
  },
  orderBy: {
    date: "desc",
  },
})

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and view all patient appointments.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/more">
              <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/50 text-slate-800 font-semibold shadow-sm">
                <Settings className="h-4 w-4 text-primary" /> Manage Doctors & Specs
              </Button>
            </Link>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{session.user?.name}</div>
              <div className="text-xs text-muted-foreground">{session.user?.email}</div>
            </div>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Appointments</CardDescription>
              <CardTitle className="text-2xl">{appointments.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-2xl">
                {appointments.filter(a => a.status === 'Pending').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Confirmed</CardDescription>
              <CardTitle className="text-2xl">
                {appointments.filter(a => a.status === 'Confirmed').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>A list of all patient bookings in the system.</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search appointments..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {appointment.patientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {appointment.patientPhone}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {appointment.patientEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{appointment.doctor.name}</div>
                        <div className="text-xs text-muted-foreground">{appointment.doctor.specialty}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(new Date(appointment.date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {appointment.timeSlot}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            appointment.status === 'Confirmed' ? 'default' : 
                            appointment.status === 'Cancelled' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AppointmentActions 
                          appointmentId={appointment.id} 
                          currentStatus={appointment.status} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
