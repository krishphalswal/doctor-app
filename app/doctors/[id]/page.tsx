import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Users, Clock, Award, CheckCircle2 } from 'lucide-react'
import prisma from '@/lib/db'
import { BookingForm } from '@/components/booking-form'

interface DoctorDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  })

  if (!doctor) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: Doctor Profile */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative h-64 w-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image 
                src={doctor.imageUrl}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-sm">{doctor.specialty}</Badge>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                  <Star className="h-4 w-4 fill-current" /> 4.9 (120 reviews)
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{doctor.name}</h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                {doctor.about || `Senior specialist with over ${doctor.experience} years of experience in ${doctor.specialty.toLowerCase()} and clinical research.`}
              </p>
              <div className="flex flex-wrap gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">1,000+</div>
                    <div className="text-xs text-muted-foreground">Patients</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">{doctor.experience} yrs</div>
                    <div className="text-xs text-muted-foreground">Experience</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-bold">{doctor.availableTimings}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Education</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.education ? (
                  <p className="text-muted-foreground whitespace-pre-line">{doctor.education}</p>
                ) : (
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold">Medical Degree (MD)</div>
                        <div className="text-sm text-muted-foreground">University of Health Sciences, 2008</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold">Specialization in {doctor.specialty}</div>
                        <div className="text-sm text-muted-foreground">National Institute of Medicine, 2012</div>
                      </div>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Board Certified Specialist</div>
                      <div className="text-sm text-muted-foreground">American Board of Medical Specialties</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Advanced Clinical Care</div>
                      <div className="text-sm text-muted-foreground">International Healthcare Academy</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl">Book Appointment</CardTitle>
              <p className="text-sm text-muted-foreground">Reserve your slot in minutes</p>
            </CardHeader>
            <CardContent className="pt-6">
              <BookingForm doctorId={doctor.id} availableTimings={doctor.availableTimings} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
