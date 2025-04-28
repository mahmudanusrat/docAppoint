// lib/api.ts
import axios from 'axios';

// Function to fetch appointments for a patient
export const fetchAppointments = async (userId: string) => {
  try {
    const response = await axios.get(`/api/appointments`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments', error);
    throw error;
  }
};

// Function to fetch doctors (if needed for the dashboard)
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`/api/doctors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors', error);
    throw error;
  }
};
