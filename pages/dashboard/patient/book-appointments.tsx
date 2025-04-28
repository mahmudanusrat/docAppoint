"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import DoctorSelect from "@/components/DoctorSelect";
import TimeSlotSelect from "@/components/TimeSlotSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const BookAppointments = () => {
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const userId = session?.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setSubmitError("Please sign in to book an appointment");
      return;
    }

    if (!selectedDate || !selectedDoctor || !selectedSlot || !reason) {
      setSubmitError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];

      const response = await axios.post("/api/appointments", {
        date: dateStr,
        doctorId: selectedDoctor,
        timeSlotId: selectedSlot,
        reason,
        userId,
      });

      const result = response.data;

      if (
        !result.appointment ||
        !result.appointment.doctor ||
        !result.appointment.formattedDate ||
        !result.appointment.formattedTime
      ) {
        throw new Error("Appointment data incomplete");
      }

      await axios.post("/api/send-confirmation", {
        name: session?.user?.name || "Patient",
        email: session?.user?.email,
        appointmentDetails: `Appointment with ${result.appointment.doctor.name} on ${result.appointment.formattedDate} at ${result.appointment.formattedTime}`,
      });

      setSubmitSuccess(true);
      setSelectedDate(null);
      setSelectedDoctor(null);
      setSelectedSlot(null);
      setReason("");

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      console.error("Booking error:", err);
      setSubmitError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Book an Appointment
        </h2>
        <p className="text-center opacity-90 mt-1">
          Schedule your visit with our specialists
        </p>

        <form onSubmit={handleSubmit} className="py-6 space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-1">
            <DoctorSelect
              selectedDoctor={selectedDoctor}
              onChange={(id) => {
                setSelectedDoctor(id);
                setSelectedSlot(null);
                setSelectedDate(null);
              }}
            />
          </div>

          {/* Date & Time */}
          {selectedDoctor && (
            <div className="flex flex-col md:flex-row gap-1">
              <div className="flex-1 space-y-1">
                <label className="block mb-1">Choose a Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      setSelectedDate(localDate);
                      setSelectedSlot(null);
                    }
                  }}
                  filterDate={(date) => !isWeekend(date)}
                  minDate={new Date()}
                  className="border p-2 rounded w-full"
                  placeholderText="Select a date"
                />
              </div>

              {/* Time Slot */}
              {selectedDate && (
                <div className="flex-1 space-y-1">
                  <TimeSlotSelect
                    doctorId={selectedDoctor}
                    selectedDate={selectedDate}
                    onSelectSlot={setSelectedSlot}
                    selectedSlot={selectedSlot}
                  />
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1">
            <label className="block mb-1">Reason for Appointment</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Briefly describe your reason for the appointment"
            />
          </div>

          {/* Error & Success Messages */}
          {submitError && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{submitError}</p>
            </div>
          )}
          {submitSuccess && (
            <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p>Appointment booked successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !selectedDate ||
              !selectedDoctor ||
              !selectedSlot ||
              !reason
            }
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
              isSubmitting ||
              !selectedDate ||
              !selectedDoctor ||
              !selectedSlot ||
              !reason
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Book Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointments;
