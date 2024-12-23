'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Define interface for Student Engagement
interface StudentEngagement {
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
  const { courseId } = useParams(); // Get courseId from the URL
  const [studentEngagementData, setStudentEngagementData] = useState<StudentEngagement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentEngagement = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/progress/student-engagement/${courseId}`);
        setStudentEngagementData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch student engagement data.');
        setLoading(false);
        console.error(err.message);
      }
    };

    if (courseId) fetchStudentEngagement();
  }, [courseId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };

  if (loading) {
    return <p className="text-gray-400 text-center">Loading student engagement data...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Null check for studentEngagementData
  if (!studentEngagementData) {
    return <p className="text-red-500 text-center">No data available for student engagement.</p>;
  }

  // Bar chart data for visualizing student performance
  const performanceData = {
    labels: ['Below Average', 'Average', 'Above Average', 'Excellent'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          studentEngagementData.performanceMetrics.belowAverage,
          studentEngagementData.performanceMetrics.average,
          studentEngagementData.performanceMetrics.aboveAverage,
          studentEngagementData.performanceMetrics.excellent,
        ],
        backgroundColor: '#4BC0C0', // You can change this color as needed
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Export PDF for the student engagement data
  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/progress/export-student-engagement/pdf/${courseId}`, {
        responseType: 'blob', // Expecting PDF in response
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'student_engagement_report.pdf'; // Filename for the downloaded PDF
      link.click();
    } catch (err) {
      console.error('Error exporting student engagement PDF:', err);
      setError('Failed to export the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Student Engagement</h1>

      {/* Enrolled and Completed Students */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Course Engagement</h2>
        <p className="text-white">Enrolled Students: {studentEngagementData.enrolledStudentsCount}</p>
        <p className="text-white">Completed Students: {studentEngagementData.completedStudentsCount}</p>
      </div>

      {/* Performance Metrics Visualization */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Performance Metricss</h2>
        <div className="w-full h-[300px] mx-auto">
          <Bar data={performanceData} options={chartOptions} />
        </div>
      </div>

      {/* PDF Export Button */}
      <button
        onClick={handleExportPDF}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export Student Engagement Report (PDF)'}
      </button>
    </div>
  );
}
