// pages/admin/manage-appointments.tsx
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma"; // adjust if needed
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import React from "react";

interface ManageAppointmentsProps {
  appointments: {
    id: string;
    doctor: { name: string };
    user: { name: string };
    date: string; // now it's string after serialization
    status: string;
  }[];
}

const ManageAppointments = ({ appointments }: ManageAppointmentsProps) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="border p-4 my-2 rounded shadow">
              <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
              <p><strong>Patient:</strong> {appointment.user.name}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: {
        select: { name: true },
      },
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Serialize Date to string
  const serializedAppointments = appointments.map((appointment) => ({
    ...appointment,
    date: appointment.date.toISOString(),
  }));

  return {
    props: { appointments: serializedAppointments },
  };
};

export default ManageAppointments;
