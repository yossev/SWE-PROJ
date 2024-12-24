'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function RateInstructorPage() {
  const router = useRouter();
  const [instructorEmail, setInstructorEmail] = useState<string>(''); 
  const [selectedInstructors, setSelectedInstructors] = useState<any>({});
  const [rating, setRating] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null); 
  const [instructors, setInstructors] = useState<any[]>([]); // To store list of instructors
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [ratedEntity] = useState<'Instructor'>('Instructor'); 
  const [courses, setCourses] = useState<any[]>([]);

  const userId = getCookie("userId");
  const role = getCookie("role");

  useEffect(() => {
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

        const coursesWithInstructors = await Promise.all(courseResponses.map(async (response) => {
          const course = response.data;
          // Fetch the instructor info based on the created_by field (assuming this is the instructor's ID)
          const instructorResponse = await axios.get(`http://localhost:3001/users/fetch/${course.created_by}`);
          const instructorEmail = instructorResponse.data.email; // Or any other instructor info
          return { ...course, instructorEmail };
        }));

        setCourses(coursesWithInstructors);
      } catch (error) {
        console.error('Error fetching user-specific courses:', error);
        setError('Failed to load courses.');
      }
    };

    fetchUserSpecificCourses();
  }, [userId]);

  const handleInstructorChange = (courseId: string, instructorEmail: string) => {
    setSelectedInstructors((prev: any) => ({
      ...prev,
      [courseId]: instructorEmail,
    }));
  };

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
