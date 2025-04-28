// pages/api/appointments/[id].ts

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const appointment = await prisma.appointment.findUnique({
      where: { id: id as string },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.status(200).json(appointment);
  }

  if (req.method === "DELETE") {
    await prisma.appointment.delete({
      where: { id: id as string },
    });
    return res.status(200).json({ message: "Appointment deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
