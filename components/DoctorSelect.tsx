// components/DoctorSelect.tsx
import { useEffect, useState } from "react";

type DoctorSelectProps = {
  selectedDoctor: string | null;
  onChange: (doctorId: string) => void;
};

export default function DoctorSelect({ selectedDoctor, onChange }: DoctorSelectProps) {
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  return (
    <div className="mb-4">
      <label className="block mb-1">Choose a Doctor</label>
      <select
        value={selectedDoctor || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>
    </div>
  );
}
