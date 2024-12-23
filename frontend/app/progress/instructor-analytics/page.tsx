'use client';

import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white p-4 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Instructor Analytics</h1>
      
      <div className="space-x-4">
        <button
          onClick={() => handleNavigate('/progress/instructor-analytics/content-effectiveness/6763257719f25f9df8913f68/67686e00d80675bf621fdd21')}
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
