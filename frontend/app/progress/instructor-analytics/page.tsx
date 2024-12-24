'use client';

import { getCookie } from 'cookies-next';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const path = usePathname().split('/');
  const [isInstructor, setIsInstructor] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const getInstructorData = async () => {
      const instructor = path[path.length - 1];
      const res = await fetch('http://localhost:3001/users/fetch/' + instructor, { credentials: 'include' });
      return res.json();
    };
    const { courseId } = useParams();
    const role = getCookie("role");
    console.log("Role fetched: " + role);
  
    const userId = getCookie("userId");
    console.log("User ID: " + userId);
    useEffect(() => {
    
      const role = getCookie('role');
      console.log("Role: ", role);
      if (role === 'student') {
        setIsInstructor(true);
      } else {
        setError('You are not authorized to view this page.');
      }
    }, []);
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Instructor Analytics</h1>
      
      <div className="space-x-4">
        <button
          onClick={() => handleNavigate(`/progress/instructor-analytics/content-effectiveness/${courseId}/instructor/${userId}`)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Content Effectiveness
        </button>

        <button
          onClick={() => handleNavigate('/progress/instructor-analytics/student-engagement/6763257719f25f9df8913f68')}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Student Engagement
        </button>

        <button
          onClick={() => handleNavigate('/progress/instructor-analytics/assessment-results/6763257719f25f9df8913f68')}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Quiz Results
        </button>
      </div>
    </div>
  );
}
