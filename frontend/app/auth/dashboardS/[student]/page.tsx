'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { getCookie, getCookies } from 'cookies-next';
import CourseNotes from 'components/CourseNotes';
import Link from 'next/link';
import Navbar from 'components/Navbar'; // Import the Navbar component

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  progress: number;
  attendanceRate?: number;
};

export default function StudentDashboard() {
  const path = usePathname().split('/');
  const student = path[path.length - 1]; // Extract the student ID from the URL

  const [courses, setCourses] = useState<Course[]>([]);
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [notesRefresh , setNotesRefresh] = useState(true);
  const [notes , setNotes] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_picture_url: '',
  });
  const [loading, setLoading] = useState(false);

  const role = getCookie('role');
  const userId = getCookie('userId') || '';

  const fetchStudentData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users/fetch/${userId}`, { withCredentials: true });
      const data = res.data;

      if (data) {
        setStudentName(data.name);
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchUserSpecificCourses = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/users/fetch/${userId}`); 
        const user = response.data;
        const enrolledCourseIds = user.courses;

        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            console.log('No courses found for this user');
            return;
        }

        const courseResponses = await Promise.all(
            enrolledCourseIds.map((courseId: any) =>
                axios.get(`http://localhost:3001/courses/${courseId}`)
            )
        );

        const courses = courseResponses.map((response) => response.data);
        setCourses(courses);
        console.log(courses);
    } catch (error) {
        console.error('Error fetching user-specific courses:', error);
    }
};


  const updateUserInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.put('http://localhost:3001/users/me', formData, { withCredentials: true });
      if (res.status === 200) {
        alert('User info updated successfully!');
        setIsModalOpen(false);
      } else {
        alert('Failed to update user info.');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('Failed to update user info.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== 'student') {
      setError('You are not authorized to view this page.');
      return;
    }

    fetchStudentData();
    fetchUserSpecificCourses();

    if(notesRefresh)
    {
      async function getNotes() {
        try {
            const response = await fetch('http://localhost:3001/notes/getAll' , {credentials : 'include'});
            const dataJson = await response.json();
            setNotes(dataJson);
        } catch (error) {
            console.log(error);
        }
    }

    getNotes();

    setNotesRefresh(false);


    }
  }, [notesRefresh]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Add Navbar above Sidebar */}
      <Navbar userId={userId} />

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
          <div className="p-6 border-b border-gray-700 text-2xl font-bold">
            Student Dashboard
          </div>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  🏫 My Courses
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  ✏ Edit Profile
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {studentName || 'Student'}</h1>
            <p className="text-gray-600">Track your progress and manage your account.</p>
          </header>

          {/* Redirection Box */}
          {/* Dashboard Sections */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Link
              href="http://localhost:3000/courses"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Management</h2>
              <p className="text-gray-600">Organize and manage your courses effectively.</p>
            </Link>
            <Link
              href="http://localhost:3000/modules/moduleid"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Modules</h2>
              <p className="text-gray-600">Engage students with interactive content.</p>
            </Link>
            <Link
              href="/progress/dashboard/userId"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Tracking</h2>
              <p className="text-gray-600">Monitor student progress and scores.</p>
            </Link>
          </section>


          {/* Courses Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105">
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-gray-600">Instructor: {course.instructor}</p>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-300 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{course.progress}% Complete</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Notes</h2>
              <CourseNotes data = { notes } userId={userId} courseId={null} setRefresh={setNotesRefresh} />
            </section>
        </main>

        

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={(e) => { e.preventDefault(); updateUserInfo(); }}>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </label>
                <label className="block mb-2">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </label>
                <label className="block mb-2">
                  Password:
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </label>
                <label className="block mb-2">
                  Profile Picture URL:
                  <input
                    type="text"
                    name="profile_picture_url"
                    value={formData.profile_picture_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
