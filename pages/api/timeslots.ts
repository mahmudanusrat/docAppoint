import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
) {
  const { doctorId, day, date } = req.query;

  if (!doctorId || !day || !date) {
    return res
      .status(400)
      .json({ error: "Doctor ID, day, and date are required" });
  }

  try {
    // Normalize date to UTC
    const dateObj = new Date(date as string);
    // Convert to UTC midnight
    const utcDate = new Date(Date.UTC(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    ));
    // Get all time slots for this doctor and day
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        doctorId: String(doctorId),
        day: String(day),
      },
      select: {
        id: true,
        time: true,
      },
      orderBy: {
        time: "asc"
      }
    });

    // Get booked appointments for this date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: String(doctorId),
        date: {
            equals: utcDate // Exact date match
          }
      },
      select: {
        timeSlotId: true,
      },
    });

    const bookedSlotIds = new Set(appointments.map(a => a.timeSlotId));

    // Return available slots with booking status
    const availableSlots = timeSlots.map(slot => ({
      id: slot.id,
      time: slot.time,
      isBooked: bookedSlotIds.has(slot.id),
    }));

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ error: "Failed to fetch time slots" });
  }
}