'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface EngagementMetrics {
  enrolledStudentsCount: number;
  completedStudentsCount: number;
  performanceMetrics: {
    belowAverage: number;
    average: number;
    aboveAverage: number;
    excellent: number;
  };
}

export default function StudentEngagementPage() {
  const { courseId } = useParams(); // Extract the dynamic courseId from the URL
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementMetrics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/progress/student-engagement/${courseId}`
        );
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch engagement metrics.');
        console.error(err);
      }
    };

    if (courseId) {
      fetchEngagementMetrics();
    }
  }, [courseId]);

  // Data for the performance metrics chart
  const performanceData = metrics
    ? {
        labels: ['Below Average', 'Average', 'Above Average', 'Excellent'],
        datasets: [
          {
            label: 'Number of Students',
            data: [
              metrics.performanceMetrics.belowAverage,
              metrics.performanceMetrics.average,
              metrics.performanceMetrics.aboveAverage,
              metrics.performanceMetrics.excellent,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-6 flex flex-col items-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Student Engagement</h1>

      {error && <p className="text-red-500">{error}</p>}

      {metrics ? (
        <div className="space-y-6 w-full max-w-4xl">
          {/* Enrolled and Completed Students */}
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-2">Course Metrics</h2>
            <p className="text-base">
              Enrolled Students: {metrics.enrolledStudentsCount}
            </p>
            <p className="text-base">
              Completed Students: {metrics.completedStudentsCount}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Performance Metrics
            </h2>
            <div className="h-64">
              {performanceData ? (
                <Bar data={performanceData} options={chartOptions} />
              ) : (
                <p className="text-gray-400 text-center">
                  No performance metrics available.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center">Loading...</p>
      )}
    </div>
  );
}
