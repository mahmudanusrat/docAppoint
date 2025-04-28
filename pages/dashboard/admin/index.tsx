import React from 'react';
import DashboardCard from '../../../components/DashboardCard';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Manage Users" 
          description="View and manage all system users"
          href="/dashboard/admin/manage-users"
          icon="users"
          color="blue"
        />
        
        <DashboardCard 
          title="Manage Appointments" 
          description="View and manage all appointments"
          href="/dashboard/admin/manage-appointments"
          icon="list"
          color="green"
        />
        
        <DashboardCard 
          title="Manage Doctors" 
          description="View and manage doctor profiles"
          href="/dashboard/admin/manage-doctors"
          icon="user"
          color="purple"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Users</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Upcoming Appointments</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Active Doctors</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;