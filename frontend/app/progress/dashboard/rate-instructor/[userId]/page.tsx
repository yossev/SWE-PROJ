'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function RateInstructorPage() {
  const router = useRouter();
  const [instructorEmail, setInstructorEmail] = useState<string>(''); 
  const [rating, setRating] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null); 
  const [instructors, setInstructors] = useState<any[]>([]); // To store list of instructors
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [ratedEntity] = useState<'Instructor'>('Instructor'); 

  const userId = getCookie("userId");
  const role = getCookie("role");

  useEffect(() => {
    if (role !== 'student') {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    // Fetch instructors list
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/instructors', { withCredentials: true });
        setInstructors(response.data); // Assuming the response contains a list of instructors
      } catch (err) {
        setError('Failed to fetch instructors.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [role]);

  const handleInstructorEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInstructorEmail(e.target.value);
  };

  const handleRateInstructor = async () => {
    if (!instructorEmail || !rating) {
      setError('Please select an instructor and provide a rating.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/ratings', {
        ratedEntity, 
        ratedEntityId: instructorEmail,  // Use the selected instructor's email
        user_id: userId, 
        rating,
      }, { withCredentials: true });

      console.log('Rating submitted:', response.data);
      router.push(`/progress/dashboard/${userId}`);
    } catch (err) {
      setError('Failed to submit the rating.');
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Rate Instructor</h1>
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading instructors...</p>
      ) : (
        <div className="mb-4">
          <label className="text-lg">Select Instructor:</label>
          <select
            value={instructorEmail}
            onChange={handleInstructorEmailChange}
            className="w-72 p-2 bg-gray-800 text-white rounded"
          >
            <option value="" disabled>Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor._id} value={instructor.email}>
                {instructor.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="text-lg">Rate this Instructor (1-5):</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          required
          className="w-72 p-2 bg-gray-800 text-white rounded"
        />
      </div>

      <button
        onClick={handleRateInstructor}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Rate Instructor
      </button>
    </div>
  );
}
