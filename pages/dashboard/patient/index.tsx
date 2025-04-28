import React from 'react';
import DashboardCard from '../../../components/DashboardCard';

const PatientDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Book Appointment" 
          description="Schedule a new appointment with a doctor"
          href="/dashboard/patient/book-appointments"
          icon="calendar"
          color="blue"
        />
        
        <DashboardCard 
          title="My Appointments" 
          description="View and manage your upcoming appointments"
          href="/dashboard/patient/my-appointments"
          icon="list"
          color="green"
        />
        
        <DashboardCard 
          title="My Profile" 
          description="Update your personal information"
          href="/dashboard/profile"
          icon="user"
          color="purple"
        />
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {/* Recent appointments or notifications would go here */}
        <p className="text-gray-500">You have no recent activity.</p>
      </div>
    </div>
  );
};

export default PatientDashboard;