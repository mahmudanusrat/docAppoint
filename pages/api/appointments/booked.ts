// pages/api/appointments/booked.ts
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { doctorId, date } = req.body;

    const isoDate = new Date(date);
    isoDate.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: isoDate,
      },
      include: {
        timeSlot: true,
      },
    });

    const bookedSlots = appointments.map((a) => a.timeSlot.time);

    res.status(200).json({ bookedSlots });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
