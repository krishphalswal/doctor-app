import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Clock, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import prisma from '@/lib/db'

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany()

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Our Specialists</h1>
          <p className="text-muted-foreground">
            Browse through our list of expert doctors and book your appointment today.
          </p>
        </div>

        {/* Search Bar - Note: This is a static UI for now, could be made functional with client components */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or specialty..." className="pl-10" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full bg-slate-100">
                <Image 
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">{doctor.specialty}</Badge>
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                    <Star className="h-3 w-3 fill-current" /> 4.9
                  </div>
                </div>
                <CardTitle className="text-lg">{doctor.name}</CardTitle>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{doctor.experience} years exp.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{doctor.availableTimings}</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Link href={`/doctors/${doctor.id}`} className="w-full">
                  <Button className="w-full" size="sm">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
