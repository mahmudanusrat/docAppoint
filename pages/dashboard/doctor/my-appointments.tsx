import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface Appointment {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  patient: {
    name: string;
    email: string;
  };
  timeSlot: {
    time: string;
    day: string;
  };
}

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/appointments/doctor");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    
    if (filter === 'upcoming') {
      return appointmentDate >= now;
    } else if (filter === 'past') {
      return appointmentDate < now;
    }
    return true;
  });

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/appointments/${appointmentId}`, { status: newStatus });
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${filter === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-md ${filter === 'past' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      {appointment.patient.name}
                    </h3>
                    <p className="text-gray-600">{appointment.patient.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    {formatDate(appointment.date)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    {appointment.timeSlot.time} ({appointment.timeSlot.day})
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Reason:</span> {appointment.reason || 'Not specified'}
                  </p>
                </div>

                {filter === 'upcoming' && appointment.status !== 'cancelled' && (
                  <div className="mt-6 flex space-x-3">
                    {appointment.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;