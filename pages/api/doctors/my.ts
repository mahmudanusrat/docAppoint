import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "doctor") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const includeSlots = req.query.includeSlots === 'true';

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: session.user.id,
      },
      include: {
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
        ...(includeSlots && {
          timeSlot: {
            select: {
              id: true,
              time: true,
            },
          },
        }),
      },
      orderBy: {
        date: "asc",
      },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
