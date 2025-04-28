// pages/api/appointments/doctor/patients.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "DOCTOR") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const doctorId = session.user.id;

    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: true }, // assuming `patient` relation exists
    });

    // Extract unique patients
    const uniquePatientsMap = new Map();
    appointments.forEach((appointment) => {
      if (appointment.patient) {
        uniquePatientsMap.set(appointment.patient.id, appointment.patient);
      }
    });

    const patients = Array.from(uniquePatientsMap.values());

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
