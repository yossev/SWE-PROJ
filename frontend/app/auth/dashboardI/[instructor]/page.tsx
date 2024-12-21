'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

type User = {
  name:string;
  email: string;
};
export default function InstructorDashboard( {
  params, }: { params: Promise<{ instructor: string; }>
})
{
  const getInstructorData = async () => {
    const instructorId = (await (params)).instructor;
    const res = await fetch('http://localhost:3001/users/fetch/' + instructorId)
    return res.json();
}

  const [courses, setCourses] = useState([]); // Holds the list of courses
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<User|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchByEmail = async () => {
    if (!searchTerm) {
      setError('Please enter an email to search.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`http://localhost:3001/api/user/by-email?email=${(searchTerm)}`);
      if (res.status !== 200) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
      const userData = await res.data;
      setSearchResult(userData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  const searchByName = async () => {
    if (!searchTerm) {
      setError('Please enter a name to search.');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const res = await fetch(`/users/Studentfetch/${searchTerm}`);
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || 'Failed to fetch user');
      }
      const userData = await res.json();
      setSearchResult(userData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  // Scroll to "My Courses" section
  const scrollToCourses = () => {
    document.getElementById('my-courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">Instructor Dashboard</div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <button
                onClick={scrollToCourses}
                className="block w-full text-left py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                📚 My Courses
              </button>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🔍 Search Student by Name
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ✉️ Search Student by Email
              </Link>
            </li>
            <li>
              <Link
                href="/update-profile"
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ✏️ Update Personal Information
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Instructor</h1>
          <p className="text-gray-600">Manage your courses, students, and more using the dashboard below.</p>
        </header>

        {/* Dashboard Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link
            href="/course-management"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Management</h2>
            <p className="text-gray-600">Organize and manage your courses effectively.</p>
          </Link>
          <Link
            href="/interactive-modules"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Modules</h2>
            <p className="text-gray-600">Engage students with interactive content.</p>
          </Link>
          <Link
            href="/performance-tracking"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Tracking</h2>
            <p className="text-gray-600">Monitor student progress and scores.</p>
          </Link>
          <Link
            href="/real-time-chat"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-Time Chat</h2>
            <p className="text-gray-600">Communicate instantly with students.</p>
          </Link>
          <Link
            href="/discussion-forums"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Discussion Forums</h2>
            <p className="text-gray-600">Create forums for meaningful discussions.</p>
          </Link>
          <Link
            href="/notes"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
            <p className="text-gray-600">Help students take and organize notes.</p>
          </Link>
        </section>

        {/* Search Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search for a Student</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition-all duration-300"
              placeholder="Enter student name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
              onClick={searchByName}
            >
              Search by Name
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              onClick={searchByEmail}
            >
               {loading ? 'Searching...' : 'Search by Email'}
            </button>
            </div>
          {error && <p className="text-blue-500 mt-4">{error}</p>}
          
          
          
          {searchResult && (
            <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">Search Result:</h3>
              <p className="text-gray-700">Name: {searchResult.name}</p>
              <p className="text-gray-700">Email: {searchResult.email}</p>
            </div>
          )}
        </section>
          

        {/* Courses Section */}
        <section id="my-courses">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-gray-300">{course.description}</p>
                <Link href="#" className="text-indigo-400 hover:underline mt-4 inline-block">
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

