'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const AllRatings = () => {
  const [moduleRatings, setModuleRatings] = useState<any[]>([]);
  const [instructorRatings, setInstructorRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ratings when the component mounts
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ratings/all-ratings');
        setModuleRatings(response.data.moduleRatings);
        setInstructorRatings(response.data.instructorRatings);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ratings');
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <div>Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">All Feedback Submitted By Students </h1>

      {/* Module Ratings */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Module Ratings</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-2 text-left">Module ID</th>
              <th className="px-4 py-2 text-left">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {moduleRatings.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-400">No module ratings available</td>
              </tr>
            ) : (
              moduleRatings.map((rating) => (
                <tr key={rating._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{rating._id}</td>
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
