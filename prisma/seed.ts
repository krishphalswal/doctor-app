import prisma from '../lib/db.js'

async function main() {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: 12,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ca199eb2?q=80&w=200&h=200&auto=format&fit=crop",
      availableTimings: "09:00 AM - 01:00 PM"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      experience: 8,
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      availableTimings: "02:00 PM - 06:00 PM"
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: 15,
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      availableTimings: "10:00 AM - 04:00 PM"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Neurologist",
      experience: 20,
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      availableTimings: "11:00 AM - 03:00 PM"
    }
  ]

  for (const doctor of doctors) {
    await prisma.doctor.create({
      data: doctor
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
