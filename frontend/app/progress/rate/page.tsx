'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';

// Define the interface for ratings data
interface Rating {
  _id: string;
  rating: number;
  averageRating: number;
}

const AllRatings = () => {
  const path = usePathname().split('/');
  const [moduleRatings, setModuleRatings] = useState<Rating[]>([]);  // Use the Rating interface
  const [instructorRatings, setInstructorRatings] = useState<Rating[]>([]);  // Use the Rating interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = getCookie('userId');
  const role = getCookie("role");

  const getStudentData = async () => {
    const student = path[path.length - 1];
    const res = await fetch('http://localhost:3001/users/fetch/' + student, { credentials: 'include' });
    return res.json();
  };

  // Fetch ratings when the component mounts
  useEffect(() => {
    console.log("Role:", role); // Log role to verify
    if (role === 'admin') {
      setIsAdmin(true);
      const fetchRatings = async () => {
        try {
          const response = await axios.get('http://localhost:3001/ratings', { withCredentials: true });
          console.log("API Response:", response.data); // Log the full response data

          if (response.data.moduleRatings && Array.isArray(response.data.moduleRatings)) {
            setModuleRatings(response.data.moduleRatings); // Update moduleRatings
          } else {
            setError('No module ratings data available or invalid format');
          }

          if (response.data.instructorRatings && Array.isArray(response.data.instructorRatings)) {
            setInstructorRatings(response.data.instructorRatings); // Update instructorRatings
          } else {
            setError('No instructor ratings data available or invalid format');
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch ratings');
          setLoading(false);
          console.error(err);
        }
      };

      fetchRatings();
    } else {
      setError('You are not authorized to view this page.');
    }
  }, [role]);

  if (loading) {
    return <div>Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">All Feedback Submitted By Students</h1>

      {/* Module Ratings */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Module Ratings</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-2 text-left">Module ID</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {moduleRatings.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">No module ratings available</td>
              </tr>
            ) : (
              moduleRatings.map((rating) => (
                <tr key={rating._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{rating._id}</td>
                  <td className="px-4 py-2">{rating.rating}</td>
                  <td className="px-4 py-2">{rating.averageRating}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Instructor Ratings */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Instructor Ratings</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-2 text-left">Instructor ID</th>
              <th className="px-4 py-2 text-left">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {instructorRatings.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-400">No instructor ratings available</td>
              </tr>
            ) : (
              instructorRatings.map((rating) => (
                <tr key={rating._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{rating._id}</td>
                  <td className="px-4 py-2">{rating.averageRating}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRatings;
