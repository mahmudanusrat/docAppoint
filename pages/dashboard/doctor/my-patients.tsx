// doctor/my-patients.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPatients = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/appointments/doctor/patients")
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">My Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient.id} className="border p-4 my-2">
              <p>Name: {patient.name}</p>
              <p>Email: {patient.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPatients;
