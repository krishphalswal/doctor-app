import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/db"
import { MoreManagement } from "@/components/admin/more-management"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AdminMorePage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const doctors = await prisma.doctor.findMany({
    orderBy: { name: 'asc' }
  })

  const specialties = await prisma.specialty.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Doctors & Specifications Management</h1>
            <p className="text-muted-foreground">Add and manage doctors and their medical specialties.</p>
          </div>
        </div>

        <MoreManagement initialDoctors={doctors} initialSpecialties={specialties} />
      </div>
    </div>
  )
}
