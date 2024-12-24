'use client';

import { useState } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function RateInstructorPage() {
  const router = useRouter();
  const [instructorId, setInstructorId] = useState<string>(''); 
  const [rating, setRating] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null); 
  const [ratedEntity] = useState<'Instructor'>('Instructor'); 
const path = usePathname().split('/');
  
    const getStudentData = async () => {
      const student = path[path.length - 1];
      const res = await fetch('http://localhost:3001/users/fetch/' + student, { credentials: 'include' });
      return res.json();
    };
    const role = getCookie("role");
    console.log("Role fetched: " + role);
  
    const userId = getCookie("userId");

  const handleInstructorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstructorId(e.target.value);
  };

  const handleRateInstructor = async () => {
    if (!instructorId) {
      setError('Please enter a valid instructor ID.');
      return;
    }

    try {
      const userId = '67686e00d80675bf621fdd21';  //needs to change after merging hardcoded userid
      const response = await axios.post('http://localhost:3001/ratings', {
        ratedEntity, 
        ratedEntityId: instructorId, 
        user_id: userId, 
        rating,
      },{withCredentials: true});
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

      <div className="mb-4">
        <label className="text-lg">Enter Instructor ID:</label>
        <input
          type="text"
          value={instructorId}
          onChange={handleInstructorIdChange}
          placeholder="Enter instructor ID"
          className="w-72 p-2 bg-gray-800 text-white rounded"
        />
      </div>

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