// pages/api/profile.ts
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // adjust path if needed
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, email, profilePicture } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user?.email! },
      data: {
        name,
        email,
        image: profilePicture,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
