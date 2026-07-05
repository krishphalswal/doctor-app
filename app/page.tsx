import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, Star, Users, Clock } from 'lucide-react'
import prisma from '@/lib/db'

export default async function HomePage() {
  const featuredDoctors = await prisma.doctor.findMany({
    take: 3
  })

  return (
    <div className="flex flex-col gap-16 pb-16 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-24 md:py-32 w-full">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-6">
              <Badge className="w-fit" variant="secondary">Reliable Healthcare</Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Your Health, <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-lg">
                Book appointments with the best doctors in your area. Quick, easy, and secure booking system for all your medical needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/doctors">
                  <Button size="lg" className="gap-2">
                    Book Appointment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="outline">View All Doctors</Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">1</span>
                  <span className="text-sm text-muted-foreground">Expert Doctor</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">10k+</span>
                  <span className="text-sm text-muted-foreground">Happy Patients</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">4.9/5</span>
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative h-[500px]">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl -rotate-3 transition-transform hover:rotate-0"></div>
              <Image 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&h=1000&auto=format&fit=crop"
                alt="Healthcare Professional"
                fill
                className="object-cover rounded-3xl shadow-2xl relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="container w-full">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Doctors</h2>
          <p className="text-muted-foreground max-w-2xl">
            Meet our highly qualified specialists dedicated to providing you with the best medical care and personal attention.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-64 w-full bg-slate-100">
                <Image 
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{doctor.specialty}</Badge>
                  <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star className="h-4 w-4 fill-current" /> 4.9
                  </div>
                </div>
                <CardTitle>{doctor.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Users className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.availableTimings}</span>
                </div>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href={`/doctors/${doctor.id}`} className="w-full">
                  <Button className="w-full" variant="outline">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/doctors">
            <Button size="lg" variant="ghost" className="gap-2">
              View All Doctors <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="bg-slate-900 text-white py-24 w-full">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div className="relative h-[400px]">
              <Image 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&h=600&auto=format&fit=crop"
                alt="Modern Medical Center"
                fill
                className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Krish&apos;s Hospital?</h2>
              <p className="text-slate-400 text-lg">
                We are committed to making healthcare accessible and convenient for everyone. Our platform offers several advantages.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Easy Scheduling</h4>
                    <p className="text-slate-400 text-sm">Book appointments 24/7 with just a few clicks.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Top Specialists</h4>
                    <p className="text-slate-400 text-sm">Access to verified and highly experienced doctors.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 flex items-center justify-center rounded-lg text-primary">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Verified Reviews</h4>
                    <p className="text-slate-400 text-sm">Real feedback from real patients to help you decide.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
