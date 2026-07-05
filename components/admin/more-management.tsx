"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Plus, 
  Trash2, 
  Stethoscope, 
  ClipboardList, 
  Loader2, 
  Briefcase, 
  GraduationCap, 
  Image as ImageIcon, 
  Clock, 
  UserPlus, 
  UserCheck 
} from "lucide-react"
import { toast } from "sonner"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  about: string | null
  education: string | null
  imageUrl: string
  availableTimings: string
}

interface Specialty {
  id: string
  name: string
}

interface MoreManagementProps {
  initialDoctors: Doctor[]
  initialSpecialties: Specialty[]
}

export function MoreManagement({ initialDoctors, initialSpecialties }: MoreManagementProps) {
  const [activeTab, setActiveTab] = useState<"doctors" | "specialties">("doctors")
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties)
  const router = useRouter()

  // Form states - Specialties
  const [specialtyName, setSpecialtyName] = useState("")
  const [isSubmittingSpecialty, setIsSubmittingSpecialty] = useState(false)

  // Form states - Doctors
  const [docName, setDocName] = useState("")
  const [docSpecialty, setDocSpecialty] = useState("")
  const [docExperience, setDocExperience] = useState("")
  const [docAbout, setDocAbout] = useState("")
  const [docEducation, setDocEducation] = useState("")
  const [docImageUrl, setDocImageUrl] = useState("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&h=400&auto=format&fit=crop")
  const [docTimings, setDocTimings] = useState("Mon-Sat: 10AM-2PM, 5PM-7PM")
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false)

  // Delete states
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Handle adding specialty
  async function handleAddSpecialty(e: React.FormEvent) {
    e.preventDefault()
    if (!specialtyName.trim()) {
      toast.error("Please enter a specialty name")
      return
    }

    setIsSubmittingSpecialty(true)
    try {
      const response = await fetch("/api/admin/specialties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: specialtyName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add specialty")
      }

      toast.success("Specialty / Specification added successfully!")
      setSpecialties((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setSpecialtyName("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmittingSpecialty(false)
    }
  }

  // Handle deleting specialty
  async function handleDeleteSpecialty(id: string) {
    if (!confirm("Are you sure you want to delete this specialty? Doctors with this specialty will still have it in their profile, but it will be removed from future selection options.")) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/specialties?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete specialty")
      }

      toast.success("Specialty deleted successfully!")
      setSpecialties((prev) => prev.filter((s) => s.id !== id))
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  // Handle adding doctor
  async function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault()
    if (!docName.trim()) return toast.error("Please enter doctor name")
    if (!docSpecialty) return toast.error("Please select a specialty / specification")
    if (!docExperience) return toast.error("Please enter experience in years")
    if (!docImageUrl.trim()) return toast.error("Please enter doctor image URL")
    if (!docTimings.trim()) return toast.error("Please enter available timings")

    setIsSubmittingDoctor(true)
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          specialty: docSpecialty,
          experience: Number(docExperience),
          about: docAbout.trim() || null,
          education: docEducation.trim() || null,
          imageUrl: docImageUrl,
          availableTimings: docTimings,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add doctor")
      }

      toast.success("Doctor added successfully!")
      setDoctors((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      
      // Reset form
      setDocName("")
      setDocSpecialty("")
      setDocExperience("")
      setDocAbout("")
      setDocEducation("")
      setDocImageUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&h=400&auto=format&fit=crop")
      setDocTimings("Mon-Sat: 10AM-2PM, 5PM-7PM")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmittingDoctor(false)
    }
  }

  // Handle deleting doctor
  async function handleDeleteDoctor(id: string) {
    if (!confirm("Are you sure you want to delete this doctor? This will also cancel/delete all appointments scheduled with this doctor.")) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/doctors?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete doctor")
      }

      toast.success("Doctor deleted successfully!")
      setDoctors((prev) => prev.filter((d) => d.id !== id))
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation tabs */}
      <div className="flex border-b border-muted">
        <button
          onClick={() => setActiveTab("doctors")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "doctors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          Doctors ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab("specialties")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "specialties"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Specialties / Specifications ({specialties.length})
        </button>
      </div>

      {/* Panels */}
      {activeTab === "doctors" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Doctor Form */}
          <div className="lg:col-span-5">
            <Card className="shadow-md">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserPlus className="h-5 w-5 text-primary" /> Add New Doctor
                </CardTitle>
                <CardDescription>Enter details to add a new medical practitioner.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="docName">Doctor's Name</Label>
                    <Input
                      id="docName"
                      placeholder="e.g. Dr. Jane Smith"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="docSpecialty">Specialty / Specification</Label>
                      {specialties.length === 0 ? (
                        <div className="text-xs text-amber-600 mt-2 font-medium">
                          Please create a specialty first in the Specialties tab.
                        </div>
                      ) : (
                        <Select onValueChange={(val) => setDocSpecialty(val || "")} value={docSpecialty}>
                          <SelectTrigger id="docSpecialty">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map((spec) => (
                              <SelectItem key={spec.id} value={spec.name}>
                                {spec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="docExperience">Experience (Years)</Label>
                      <Input
                        id="docExperience"
                        type="number"
                        min="0"
                        placeholder="e.g. 10"
                        value={docExperience}
                        onChange={(e) => setDocExperience(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docTimings">Available Timings</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="docTimings"
                        className="pl-10"
                        placeholder="e.g. Mon-Fri: 9AM-1PM, 3PM-6PM"
                        value={docTimings}
                        onChange={(e) => setDocTimings(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docEducation">Education & Credentials</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="docEducation"
                        className="pl-10"
                        placeholder="e.g. MBBS, MD, FACC"
                        value={docEducation}
                        onChange={(e) => setDocEducation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docImageUrl">Image URL</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="docImageUrl"
                        className="pl-10"
                        placeholder="https://images.unsplash.com/..."
                        value={docImageUrl}
                        onChange={(e) => setDocImageUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docAbout">About / Biography</Label>
                    <textarea
                      id="docAbout"
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell patients about the doctor's experience, background, or approach..."
                      value={docAbout}
                      onChange={(e) => setDocAbout(e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 mt-2" 
                    disabled={isSubmittingDoctor || specialties.length === 0}
                  >
                    {isSubmittingDoctor ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Add Doctor
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-7">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Current Doctors</CardTitle>
                <CardDescription>A list of all active doctors in the hospital.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead className="hidden md:table-cell">Experience</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                            No doctors registered yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        doctors.map((doctor) => (
                          <TableRow key={doctor.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 relative rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                  <img
                                    src={doctor.imageUrl}
                                    alt={doctor.name}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">{doctor.name}</span>
                                  <span className="text-xs text-muted-foreground md:hidden">{doctor.experience} yrs exp</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="whitespace-nowrap">{doctor.specialty}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-sm">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                {doctor.experience} Years
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                disabled={deletingId === doctor.id}
                              >
                                {deletingId === doctor.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "specialties" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Specialty Form */}
          <div className="lg:col-span-5">
            <Card className="shadow-md">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ClipboardList className="h-5 w-5 text-primary" /> Add Specialty / Specification
                </CardTitle>
                <CardDescription>Define a new medical department or physician specification.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddSpecialty} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialtyName">Specialty Name</Label>
                    <Input
                      id="specialtyName"
                      placeholder="e.g. Cardiology, Paediatrics, Neurology"
                      value={specialtyName}
                      onChange={(e) => setSpecialtyName(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 mt-2" 
                    disabled={isSubmittingSpecialty}
                  >
                    {isSubmittingSpecialty ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Add Specialty
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Specialties List */}
          <div className="lg:col-span-7">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Current Specialties</CardTitle>
                <CardDescription>Departments and specialties currently configured.</CardDescription>
              </CardHeader>
              <CardContent>
                {specialties.length === 0 ? (
                  <div className="text-center py-10 border rounded-md text-muted-foreground">
                    No specialties/specifications defined yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specialties.map((spec) => (
                      <div 
                        key={spec.id} 
                        className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/30 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                          <UserCheck className="h-4 w-4 text-primary" />
                          {spec.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteSpecialty(spec.id)}
                          disabled={deletingId === spec.id}
                        >
                          {deletingId === spec.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
