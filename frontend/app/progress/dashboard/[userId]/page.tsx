'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

// Define interfaces based on the backend response
interface CourseCompletion {
  courseId: string;
}

interface CourseCompletionRate {
  completionRate: number;
}

interface EngagementTrend {
  courseId: string;
  attendanceRate: number;
  completedStudentCount: number;
}

interface Dashboard {
  averageScore: number;
  classification: string;
  completedCourses: CourseCompletion[];
  courseCompletionRates: CourseCompletionRate[];
  engagementTrends: EngagementTrend[];
  progress: any;
}

export default function DashboardPage() {
  const { userId } = useParams(); // Extract userId from the dynamic route
  console.log('Extracted User ID:', userId);

  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('Fetching data for userId:', userId);
        const response = await axios.get(`http://localhost:3001/progress/dashboard/${userId}`);
        console.log('API Response:', response.data);
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Error fetching dashboard:', err.message);
        console.error('Error Details:', err.response?.data || err);
        setError('Failed to fetch dashboard data. Please try again later.');
      }
    };
  
    if (userId) {
      fetchDashboard();
    }
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dashboardData ? (
        <div>
          {/* Average Score */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Average Score</h2>
            <p>{dashboardData.averageScore.toFixed(2)}%</p>
          </div>

          {/* Classification */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Classification</h2>
            <p>{dashboardData.classification}</p>
          </div>

          {/* Completed Courses */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Completed Courses</h2>
            {dashboardData.completedCourses.length ? (
              <ul>
                {dashboardData.completedCourses.map((course, idx) => (
                  <li key={idx}>
                    Course ID: {course.courseId}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No completed courses.</p>
            )}
          </div>

          {/* Course Completion Rates */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Course Completion Rates</h2>
            {dashboardData.courseCompletionRates.length ? (
              <ul>
                {dashboardData.courseCompletionRates.map((rate, idx) => (
                  <li key={idx}>
                    Completion Rate: {rate.completionRate}%
                  </li>
                ))}
              </ul>
            ) : (
              <p>No course completion data available.</p>
            )}
          </div>

          {/* Engagement Trends */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Engagement Trends</h2>
            {dashboardData.engagementTrends.length ? (
              <ul>
                {dashboardData.engagementTrends.map((trend, idx) => (
                  <li key={idx}>
                    Course ID: {trend.courseId} | Attendance Rate: {trend.attendanceRate}% | Completed Students: {trend.completedStudentCount}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No engagement data available.</p>
            )}
          </div>

          {/* Progress Data */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Progress Data</h2>
            <pre className="bg-gray-100 p-2">{JSON.stringify(dashboardData.progress, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
}
