import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { date, doctorId, timeSlotId, reason, userId } = req.body;

    if (!date || !doctorId || !timeSlotId || !reason || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Convert date to Date object and normalize to UTC
      const utcDate = new Date(date);
      utcDate.setUTCHours(0, 0, 0, 0); // Same normalization
      const timeSlot = await prisma.timeSlot.findUnique({
        where: { id: timeSlotId },
      });

      if (!timeSlot) {
        return res.status(400).json({ error: "Time slot not found" });
      }

      // Check if appointment already exists
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          timeSlotId,
          date: utcDate,
          doctorId,
        },
      });

      if (existingAppointment) {
        return res
          .status(400)
          .json({ error: "This time slot is already booked" });
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          date: utcDate,
          doctorId,
          reason,
          timeSlotId,
          userId,
        },
        include: {
          timeSlot: true,
          doctor: true,
        },
      });

       // Format the date for display
  const formattedDate = appointment.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
      
  res.status(200).json({
    message: "Appointment booked successfully!",
    appointment: {
      ...appointment,
      formattedDate,
      formattedTime: appointment.timeSlot?.time || "Not specified"
    }
  });
    } catch (error) {
      console.error("Error creating appointment:", error);
      return res.status(500).json({ error: "Failed to book appointment" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
