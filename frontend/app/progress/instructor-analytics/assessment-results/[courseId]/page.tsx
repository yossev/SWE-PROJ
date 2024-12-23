'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Define interface for Assessment Results
interface AssessmentResult {
  quizId: string;
  averageScore: number;
  numParticipants: number;
  moduleTitle: string;
  courseName: string;
}

interface AssessmentResults {
  courseId: string;
  results: AssessmentResult[];
}

export default function AssessmentResultsPage() {
  const { courseId } = useParams(); // Get courseId from the URL
  const [assessmentResultsData, setAssessmentResultsData] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/progress/assessment-results/${courseId}`);
        if (response.data && response.data.results) {
          setAssessmentResultsData(response.data);
        } else {
          setError('No results found for this course.');
        }
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch assessment results data.');
        setLoading(false);
        console.error(err.message);
      }
    };

    if (courseId) fetchAssessmentResults();
  }, [courseId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };

  if (loading) {
    return <p className="text-gray-400 text-center">Loading assessment results...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Null check for assessmentResultsData
  if (!assessmentResultsData || !assessmentResultsData.results || assessmentResultsData.results.length === 0) {
    return <p className="text-red-500 text-center">No data available for assessment results.</p>;
  }

  // Bar chart data for visualizing quiz results
  const quizData = {
    labels: assessmentResultsData.results.map((result) => result.moduleTitle), // Module title as x-axis
    datasets: [
      {
        label: 'Average Score',
        data: assessmentResultsData.results.map((result) => result.averageScore),
        backgroundColor: '#4BC0C0',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Export PDF for the assessment results
  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/progress/export-assessment-results/pdf/${courseId}`, {
        responseType: 'blob', // Expecting PDF in response
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'assessment_results_report.pdf'; // Filename for the downloaded PDF
      link.click();
    } catch (err) {
      console.error('Error exporting assessment results PDF:', err);
      setError('Failed to export the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Assessment Results</h1>

      {/* Course Assessment Data */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Assessment Results Overview</h2>
        <p className="text-white">Course ID: {courseId}</p>
        <p className="text-white">Total Quizzes: {assessmentResultsData.results.length}</p>
      </div>

      {/* Quiz Results Visualization */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
        <h2 className="text-lg font-semibold">Quiz Results (Average Scores)</h2>
        <div className="w-full h-[300px] mx-auto">
          <Bar data={quizData} options={chartOptions} />
        </div>
      </div>

      {/* PDF Export Button */}
      <button
        onClick={handleExportPDF}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export Assessment Results (PDF)'}
      </button>
    </div>
  );
}