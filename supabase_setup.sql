-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS "Appointment" CASCADE;
DROP TABLE IF EXISTS "Doctor" CASCADE;
DROP TABLE IF EXISTS "Specialty" CASCADE;

-- Create Specialty table
CREATE TABLE "Specialty" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Doctor table
CREATE TABLE "Doctor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "about" TEXT,
    "education" TEXT,
    "imageUrl" TEXT NOT NULL,
    "availableTimings" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Appointment table
CREATE TABLE "Appointment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "doctorId" UUID REFERENCES "Doctor"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Specialty seed data
INSERT INTO "Specialty" ("name") VALUES
('Paediatrics'),
('Cardiology'),
('Neurology'),
('Orthopaedics'),
('General Medicine')
ON CONFLICT ("name") DO NOTHING;

-- Insert Doctor seed data (matching the local SQLite seed)
INSERT INTO "Doctor" ("id", "name", "specialty", "experience", "about", "education", "imageUrl", "availableTimings") VALUES
('11111111-1111-1111-1111-111111111111', 'Dr. N.S. Yadav', 'Paediatrics', 38, 'Dr. Yadav is the pioneer of paediatric care in south Haryana. He received his MD from Rohtak Medical College. The Indian Academy of Paediatrics, Haryana, in recognition of his 38 years of service, has recently honored him with a lifetime achievement award.', 'MBBS, DCh, MD, MBBS and MD from Rohtak Medical College', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=400&auto=format&fit=crop', 'Mon-Sat: 10AM-2PM, 5PM-7PM')
ON CONFLICT ("id") DO NOTHING;
