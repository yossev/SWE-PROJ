'use client';

import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { get } from 'http';

interface ModuleRating {
  moduleId: string;
  averageRating: number;
}

interface ContentEffectivenessData {
  courseId: string;
  courseRating: number;
  instructorRating: number;
  moduleRatings: ModuleRating[];
}

export default function ContentEffectivenessPage() {
  const path = usePathname().split('/');
    
  const getInstructorData = async () => {
    const instructor = path[path.length - 1];
    const res = await fetch('http://localhost:3001/users/fetch/' + instructor, { credentials: 'include' });
    return res.json();
  };
  const { courseId} = useParams(); // Extract courseId and instructorId from URL
  const [contentEffectivenessData, setContentEffectivenessData] = useState<ContentEffectivenessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInstructor, setIsInstructor] = useState(false);
const userId=getCookie("userId");
const role= getCookie("role");
  useEffect(() => {
    const role = getCookie('role');
      console.log("Role: ", role);
      if (role === 'instructor') {
        setIsInstructor(true);
      } else {
        setError('You are not authorized to view this page.');
      }
    const fetchContentEffectivenessData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/progress/content-effectiveness/${courseId}`,{withCredentials: true});
        if (response.data) {
          setContentEffectivenessData(response.data);
        } else {
          setError('No data available for this course and instructor.');
        }
      } catch (err) {
        setError('Failed to fetch content effectiveness data.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && userId) fetchContentEffectivenessData();
  }, [courseId, userId]);

  if (loading) {
    return <p className="text-gray-400 text-center">Loading content effectiveness data...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!contentEffectivenessData) {
    return <p className="text-red-500 text-center">No content effectiveness data found.</p>;
  }

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/progress/export-content-effectiveness-pdf/${courseId}`, {
        responseType: 'blob', // Expecting PDF in response
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'content_effectiveness_report.pdf'; // Filename for the downloaded PDF
      link.click();
    } catch (err) {
      console.error('Error exporting content effectiveness PDF:', err);
      setError('Failed to export the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Content Effectiveness</h1>
      
      {/* Course Rating Overview */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Course Rating Overview</h2>
        <p className="text-white">Course ID: {contentEffectivenessData.courseId}</p>
        <p className="text-white">Course Rating: {contentEffectivenessData.courseRating}</p>
        <p className="text-white">Instructor Rating: {contentEffectivenessData.instructorRating}</p>
      </div>

      {/* Module Ratings */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Module Ratings</h2>
        {contentEffectivenessData.moduleRatings.length === 0 ? (
          <p>No module ratings available for this course.</p>
        ) : (
          <ul>
            {contentEffectivenessData.moduleRatings.map((module) => (
              <li key={module.moduleId}>
                Module ID: {module.moduleId}, Average Rating: {module.averageRating}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExportPDF}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export Content Effectiveness Results (PDF)'}
      </button>
    </div>
  );
}
