import React, { useEffect, useState } from "react";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/doctor");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Doctors</h1>
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id} className="border p-4 my-2 rounded shadow">
              <p><strong>Name:</strong> {doctor.name}</p>
              <p><strong>Specialization:</strong> {doctor.specialty}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageDoctorsPage;
