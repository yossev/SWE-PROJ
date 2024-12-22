/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">Admin Dashboard</div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                📚 Manage Courses
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🧑 Manage Users
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🔐 Security Management
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                📢 Send Notifications
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ⭐ View Ratings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin</h1>
          <p className="text-gray-600">Manage your platform functionalities using the dashboard below.</p>
        </header>

        {/* Dashboard Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link
            href="/manage-courses"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Management</h2>
            <p className="text-gray-600">Add, update, or delete courses.</p>
          </Link>
         <Link
            href="/auth/dashboardA/manage-users"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
            <p className="text-gray-600">View and manage all system users.</p>
          </Link>

          <Link
            href="/security-management"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Management</h2>
            <p className="text-gray-600">Monitor login attempts and security logs.</p>
          </Link>
          <Link
            href="/notifications"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Notifications</h2>
            <p className="text-gray-600">Broadcast announcements to users.</p>
          </Link>
          <Link
            href="/view-ratings"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">View Ratings</h2>
            <p className="text-gray-600">Check feedback and ratings from users.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
