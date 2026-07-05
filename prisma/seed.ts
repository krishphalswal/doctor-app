import prisma from '../lib/db.js'

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany({})
  await prisma.doctor.deleteMany({})
  await prisma.specialty.deleteMany({})

  const specialties = [
    { name: "Paediatrics" },
    { name: "Cardiology" },
    { name: "Neurology" },
    { name: "Orthopaedics" },
    { name: "General Medicine" }
  ]

  for (const specialty of specialties) {
    await prisma.specialty.create({
      data: specialty
    })
  }

  const doctors = [
    {
      name: "Dr. N.S. Yadav",
      specialty: "Paediatrics",
      experience: 38,
      about: "Dr. Yadav is the pioneer of paediatric care in south Haryana. He received his MD from Rohtak Medical College. The Indian Academy of Paediatrics, Haryana, in recognition of his 38 years of service, has recently honored him with a lifetime achievement award.",
      education: "MBBS, DCh, MD, MBBS and MD from Rohtak Medical College",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=400&auto=format&fit=crop",
      availableTimings: "Mon-Sat: 10AM-2PM, 5PM-7PM"
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
