import { useState, useEffect } from "react";

interface Props {
  doctorId: string | null;
  selectedDate: Date | null;
  onSelectSlot: (slotId: string) => void;
  selectedSlot?: string | null;
}

export default function TimeSlotSelect({ 
  doctorId, 
  selectedDate, 
  onSelectSlot, 
  selectedSlot 
}: Props) {
  const [timeSlots, setTimeSlots] = useState<
    { id: string; time: string; isBooked: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!doctorId || !selectedDate) {
        setTimeSlots([]);
        return;
      }

      const dayOfWeek = selectedDate.toLocaleString("en-us", { weekday: "long" });
      const dateStr = selectedDate.toISOString().split('T')[0];

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/timeslots?doctorId=${doctorId}&day=${dayOfWeek}&date=${dateStr}&_=${Date.now()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }

        const data = await response.json();
        setTimeSlots(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error fetching time slots. Please try again.");
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [doctorId, selectedDate]);

  // Function to check if selected date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Function to get current time in minutes since midnight
  const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  // Function to convert time string to minutes since midnight
  const timeToMinutes = (timeString: string) => {
    if (timeString.includes('AM') || timeString.includes('PM')) {
      // Handle 12-hour format
      const [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    }
    // Handle 24-hour format
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to format time display
  const formatTimeDisplay = (timeString: string) => {
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Filter time slots for today
  const filteredTimeSlots = selectedDate && isToday(selectedDate)
    ? timeSlots.filter(slot => {
        const slotMinutes = timeToMinutes(slot.time);
        const currentMinutes = getCurrentTimeInMinutes();
        return slotMinutes > currentMinutes;
      })
    : timeSlots;

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading time slots...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!doctorId) {
    return <div className="p-4 text-center text-gray-500">Please select a doctor first</div>;
  }

  if (!selectedDate) {
    return <div className="p-4 text-center text-gray-500">Please select a date first</div>;
  }

  return (
    <div className="mb-4">
      <label className="block mb-1">Available Time Slots
      {selectedDate && isToday(selectedDate) && (
          <span className="text-xs text-gray-500 ml-2">(Showing only future slots)</span>
        )}
        </label>
      
      {filteredTimeSlots.length === 0 ? (
        <p className="text-sm text-gray-500">
          {selectedDate && isToday(selectedDate)
            ? "No available time slots remaining for today"
            : "No available time slots for this day"}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filteredTimeSlots
            .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
            .map((slot) => (
              <button
                key={slot.id}
                disabled={slot.isBooked}
                onClick={() => onSelectSlot(slot.id)}
                className={`p-2 rounded text-sm font-medium transition-colors
                  ${
                    slot.isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedSlot === slot.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                  }`}
                title={slot.isBooked ? "This slot is already booked" : ""}
              >
                {formatTimeDisplay(slot.time)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}