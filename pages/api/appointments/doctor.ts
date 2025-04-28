import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (session.user?.role !== 'DOCTOR') {
    return res.status(403).json({ message: 'Forbidden - Doctors only' });
  }

  try {
    // Get the doctor's user record
    const doctorUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { doctorProfile: true }
    });

    if (!doctorUser?.doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Get all appointments for this doctor
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorUser.doctorProfile.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        timeSlot: {
          select: {
            time: true,
            day: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      date: appointment.date.toISOString(),
      status: appointment.status,
      reason: appointment.reason,
      patient: {
        name: appointment.user.name,
        email: appointment.user.email
      },
      timeSlot: {
        time: appointment.timeSlot.time,
        day: appointment.timeSlot.day
      }
    }));

    return res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}