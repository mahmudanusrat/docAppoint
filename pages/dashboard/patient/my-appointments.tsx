// patient/my-appointments.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface TimeSlot {
  id: string;
  time: string;
}

interface Appointment {
  id: string;
  date: string;
  timeSlot: TimeSlot;
  reason: string;
  status: string;
  doctor: {
    name: string;
  };
}

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState<string>("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/appointments/my?includeSlots=true");

      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Time not specified";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return timeString;
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment");
    }
  };

  const handleEdit = (appt: Appointment) => {
    setEditingId(appt.id);
    setEditReason(appt.reason);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await axios.put(`/api/appointments/${editingId}`, {
        reason: editReason,
      });

      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Failed to update appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">My Appointments</h2>

      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-700">You don't have any appointments.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li key={appt.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(appt.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <h3 className="text-lg font-medium text-gray-900 mt-1">{appt.doctor.name}</h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appt.timeSlot ? formatTime(appt.timeSlot.time) : "Time not specified"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Reason:</span> {appt.reason}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {appt.status}
                  </p>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleEdit(appt)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>

                  {editingId === appt.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Update Reason
                      </label>
                      <input
                        type="text"
                        id="reason"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="mt-2 flex space-x-3">
                        <button
                          onClick={handleUpdate}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
