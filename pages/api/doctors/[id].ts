// pages/api/doctors/[id].ts

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const doctor = await prisma.doctor.findUnique({
      where: { id: id as string },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
