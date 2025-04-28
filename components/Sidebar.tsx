import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  ClipboardIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
  ArrowRightOnRectangleIcon as LoginIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="w-64 bg-indigo-700 text-white p-4 h-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
    <li>
      <Link href={href} className={`flex items-center py-3 px-4 rounded-lg transition-colors ${router.pathname === href ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
          <Icon className="w-5 h-5 mr-3" />
          <span>{children}</span>
       
      </Link>
    </li>
  );

  return (
    <div className="w-64 bg-indigo-700 text-white flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="bg-white text-indigo-700 rounded-lg p-2 mr-2">
            <UserGroupIcon className="w-6 h-6" />
          </span>
          DocAppoint
        </h2>
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-4 border-t border-b border-indigo-600">
        <div className="flex items-center">
          <div className="rounded-full bg-indigo-600 w-10 h-10 flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="rounded-full w-full h-full" />
            ) : (
              <UserIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium">{session?.user?.name || 'Guest'}</p>
            <p className="text-xs text-indigo-200">
              {session?.user?.role ? `${session.user.role.charAt(0)}${session.user.role.slice(1).toLowerCase()}` : 'Guest'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <NavItem href="/" icon={HomeIcon}>
            Home
          </NavItem>

         

          {/* Patient Specific Links */}
          {session?.user?.role === 'PATIENT' && (
            <>
              <NavItem href="/dashboard/patient" icon={ChartBarIcon}>
                Dashboard
              </NavItem>
              <NavItem href="/dashboard/patient/book-appointments" icon={CalendarIcon}>
                Book Appointment
              </NavItem>
              <NavItem href="/dashboard/patient/my-appointments" icon={ClipboardIcon}>
                My Appointments
              </NavItem>
            </>
          )}

          {/* Doctor Specific Links */}
          {session?.user?.role === 'DOCTOR' && (
            <>
              <NavItem href="/dashboard/doctor" icon={ChartBarIcon}>
                Dashboard
              </NavItem>
              <NavItem href="/dashboard/doctor/my-schedule" icon={ClockIcon}>
                My Schedule
              </NavItem>
              <NavItem href="/dashboard/doctor/my-appointments" icon={ClipboardIcon}>
                My Appointments
              </NavItem>
              <NavItem href="/dashboard/doctor/my-patients" icon={ClipboardIcon}>
                My Patients
              </NavItem>
            </>
          )}

          {/* Admin Specific Links */}
          {session?.user?.role === 'ADMIN' && (
            <>
              <NavItem href="/dashboard/admin" icon={ChartBarIcon}>
                Dashboard
              </NavItem>
              <NavItem href="/dashboard/admin/manage-users" icon={UsersIcon}>
                Manage Users
              </NavItem>
              <NavItem href="/dashboard/admin/manage-appointments" icon={ClipboardIcon}>
                All Appointments
              </NavItem><NavItem href="/dashboard/admin/manage-doctors" icon={ClipboardIcon}>
              Manage Doctors
              </NavItem>
            </>
          )}
          
           {/* Common Links */}
           {session && (
            <NavItem href="/dashboard/profile" icon={UserIcon}>
              My Profile
            </NavItem>
          )}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-indigo-600">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <LogoutIcon className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => router.push('/signin')}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <LoginIcon className="w-5 h-5 mr-2" />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;