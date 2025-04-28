import React from 'react';
import DashboardCard from '../../../components/DashboardCard';

const DoctorDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="My Schedule" 
          description="View and manage your availability"
          href="/dashboard/doctor/my-schedule"
          icon="clock"
          color="blue"
        />
        
        <DashboardCard 
          title="My Appointments" 
          description="View upcoming patient appointments"
          href="/dashboard/doctor/my-appointments"
          icon="list"
          color="green"
        />
        
        <DashboardCard 
          title="My Patients" 
          description="View your patient records"
          href="/dashboard/doctor/my-patients"
          icon="users"
          color="purple"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h2>
        <div className="space-y-4">
          <div className="p-4 border-b border-gray-100">
            <p className="text-gray-600">No appointments scheduled for today</p>
          </div>
          {/* Add today's appointments here */}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;