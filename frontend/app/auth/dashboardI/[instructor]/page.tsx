'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next/client';
import { usePathname } from 'next/navigation';
type User = {
  name: string;
  email: string;
};

export default function InstructorDashboard() {
  const path=usePathname().split('/');
  
  const getInstructorData = async () => {
    const instructorId = path[path.length - 1];
    const res = await fetch('http://localhost:3001/users/fetch/' + instructorId,{credentials: 'include'});
    return res.json();
  };


  const [isInstructor, setIsInstructor] = useState(false); // To track if the user is an instructor
  const [courses, setCourses] = useState([]); // Holds the list of courses
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let role=getCookie("role");
  console.log("Role fetched: " + role);

  const userId = getCookie("userId");
  console.log("User ID: " + userId);

  // Check role and set instructor state
  useEffect(() => {
    console.log('All cookies are ' + JSON.stringify(getCookies()));
    const role = getCookie('role'); // Assuming the user's role is stored in a cookie named 'role'
    console.log("Role: ", role);
    if (role === 'instructor') {
      setIsInstructor(true);
    } else {
      setError('You are not authorized to view this page.');
    }
  }, []);

  const searchByEmail = async () => {
    if (!searchTerm) {
      setError('Please enter an email to search.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(
        `http://localhost:3001/users/by-email?email=${searchTerm}`, { withCredentials: true }
      );
      if (res.status !== 200) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
      const userData = res.data;
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
      const res = await axios.get(
        `http://localhost:3001/users/Studentfetch/${searchTerm}`, { withCredentials: true }
      );
      if (res.status !== 200) {
        throw new Error(res.statusText || 'Failed to fetch user');
      }
      const userData = res.data;
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

  if (error && !isInstructor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">
          Instructor Dashboard
        </div>
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
          <p className="text-gray-600">
            Manage your courses, students, and more using the dashboard below.
          </p>
        </header>

        {/* Dashboard Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Add your dashboard sections here */}
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
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {searchResult && (
            <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">Search Result:</h3>
              <p className="text-gray-700">Name: {searchResult.name}</p>
              <p className="text-gray-700">Email: {searchResult.email}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
