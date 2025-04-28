import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if client wants to include time slots
    const includeSlots = req.query.includeSlots === "true";

    const appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      include: {
        doctor: { select: { name: true } },
        timeSlot: includeSlots ? true : false, // Conditionally include timeSlot
      },
      orderBy: {
        date: "desc",
      },
    });

    // Transform data to ensure consistent structure
    const formattedAppointments = appointments.map(appt => ({
      id: appt.id,
      date: appt.date,
      timeSlotId: appt.timeSlotId,
      reason: appt.reason,
      doctor: appt.doctor,
      timeSlot: appt.timeSlot || null // Explicitly set to null if not included
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}