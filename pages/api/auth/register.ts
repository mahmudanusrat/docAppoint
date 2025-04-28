import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { ROLES } from "../../../lib/roles";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { name, email, password, role } = req.body;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || ROLES.PATIENT,  // Default to patient if no role is specified
        },
      });

      return res.status(201).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default register;
