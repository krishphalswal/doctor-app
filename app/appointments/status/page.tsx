"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Search, Calendar, Clock, User, CheckCircle2, XCircle, Clock4, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"

const formSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
})

interface AppointmentWithDoctor {
  id: string
  patientName: string
  patientPhone: string
  patientEmail: string
  date: string
  timeSlot: string
  status: string
  doctor: {
    name: string
    specialty: string
  }
}

function AppointmentStatusInner() {
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: searchParams.get('phone') || "",
      email: searchParams.get('email') || "",
    },
  })

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsSearching(true)
    setError(null)
    setAppointments([])
    
    try {
      const response = await fetch(`/api/appointments/lookup?phone=${values.phone}&email=${values.email}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "No appointments found")
      }

      const data = await response.json()
      setAppointments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Auto-search if params are present
  useEffect(() => {
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')
    if (phone && email) {
      const timer = setTimeout(() => {
        onSubmit({ phone, email })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchParams, onSubmit])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'Cancelled': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock4 className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
      case 'Cancelled': return <Badge variant="destructive">Cancelled</Badge>
      default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge>
    }
  }

  return (
    <div className="container py-12 max-w-3xl">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Check Appointment Status</h1>
          <p className="text-muted-foreground">
            Enter your phone number and email to track your appointments.
          </p>
        </div>

        <Card className="max-w-xl mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-lg">Lookup Details</CardTitle>
            <CardDescription>Enter the details you used during booking.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-center text-sm max-w-xl mx-auto w-full">
            {error}
          </div>
        )}

        {appointments.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold px-2">Your Appointments ({appointments.length})</h2>
            <div className="grid gap-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Appointment with {appointment.doctor.name}</CardTitle>
                      <CardDescription>{appointment.doctor.specialty}</CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Patient</div>
                            <div className="font-medium">{appointment.patientName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Phone</div>
                            <div className="font-medium">{appointment.patientPhone}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Date</div>
                            <div className="font-medium">{format(new Date(appointment.date), "PPP")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Time Slot</div>
                            <div className="font-medium">{appointment.timeSlot}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-center gap-2">
                      {getStatusIcon(appointment.status)}
                      <span className="font-semibold">
                        {appointment.status === 'Pending' && "Your appointment is waiting for approval."}
                        {appointment.status === 'Confirmed' && "Great! Your appointment has been confirmed."}
                        {appointment.status === 'Cancelled' && "Sorry, your appointment has been cancelled."}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AppointmentStatusPage() {
  return (
    <Suspense fallback={<div className="container py-12 max-w-3xl text-center">Loading status...</div>}>
      <AppointmentStatusInner />
    </Suspense>
  )
}
