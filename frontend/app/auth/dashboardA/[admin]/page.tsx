'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const backend_url = 'http://localhost:3001';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backend_url}/admin/users, { withCredentials: true }`);
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users.');
    }
  };

  // Search for a user by email
  const searchByEmail = async () => {
    try {
      const response = await axios.get(`${backend_url}/admin/user-by-email?email=${searchTerm}`, { withCredentials: true });
      setSearchResult(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user by email.');
    }
  };

  // Search for a user by name
  const searchByName = async () => {
    try {
      const response = await axios.get(`${backend_url}/admin/users`);
      const filtered = response.data.filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResult(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user by name.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-extrabold">Admin Panel</div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <Link href="#" className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                🧑‍💻 Manage Users
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                ⚙️ System Settings
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                📊 View Reports
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                🔒 Security Logs
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin</h1>
          <button
            onClick={fetchUsers}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative">Get All Users</span>
          </button>
        </header>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Search Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Users</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition-all duration-300"
              placeholder="Enter email or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={searchByEmail}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative">Search by Email</span>
            </button>
            <button
              onClick={searchByName}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative">Search by Name</span>
            </button>
          </div>
          {searchResult && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <pre className="text-gray-800 text-sm">{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">User List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <div
                key={user.id}
                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <h3 className="text-xl font-bold text-white relative">{user.name}</h3>
                <p className="text-gray-400 mt-2 relative">{user.email}</p>
                <Link href="#" className="text-blue-400 hover:underline mt-4 inline-block relative">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}