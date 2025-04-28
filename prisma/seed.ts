import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30"
];

async function main() {
  console.log("Starting seed process...");

  // Create admin users
  console.log("Creating admin users...");
  const adminData = [
    { name: "Admin User", email: "admin@example.com", password: "admin123", role: "ADMIN" },
    { name: "System Admin", email: "sysadmin@example.com", password: "sysadmin123", role: "ADMIN" }
  ];

  for (const admin of adminData) {
    const hashedPassword = await hash(admin.password, 12);
    await prisma.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: admin.role,
        emailVerified: new Date(),
      },
    });
    console.log(`Created admin: ${admin.name}`);
  }

  // Create doctors
  console.log("Creating doctors...");
  const doctorData = [
    { name: "Dr. John Doe", specialty: "Cardiology", email: "john.doe1@example.com", password: "doctor123" },
    { name: "Dr. Jane Smith", specialty: "Neurology", email: "jane.smith1@example.com", password: "doctor123" },
    { name: "Dr. Emily Brown", specialty: "Pediatrics", email: "emily.brown1@example.com", password: "doctor123" },
    ];

  for (const doctor of doctorData) {
    const hashedPassword = await hash(doctor.password, 12);
    
    const user = await prisma.user.create({
      data: {
        name: doctor.name,
        email: doctor.email,
        password: hashedPassword,
        role: "DOCTOR",
        emailVerified: new Date(),
      },
    });

    await prisma.doctor.create({
      data: {
        name: doctor.name,
        specialty: doctor.specialty,
        email: doctor.email,
        userId: user.id
      },
    });

    console.log(`Created doctor: ${doctor.name}`);
  }

  // Create time slots
  console.log("Creating time slots...");
  const doctors = await prisma.doctor.findMany();
  
  for (const doctor of doctors) {
    for (const day of validDays) {
      for (const time of timeSlots) {
        await prisma.timeSlot.create({
          data: {
            doctorId: doctor.id,
            day,
            time
          }
        });
      }
    }
    console.log(`Created time slots for Dr. ${doctor.name}`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });