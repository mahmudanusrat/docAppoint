// pages/api/doctors.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const doctors = await prisma.doctor.findMany();
    return res.status(200).json(doctors);
  }

  return res.status(405).json({ error: "Method not allowed" });
}