'use client'

import { getCookie } from 'cookies-next';
import { get } from 'http';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function DashboardPortal() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const userId=getCookie("userId");
  }, []);

  const handleViewDashboard = () => {
    if (userId) {
      router.push(`/progress/dashboard/${userId}`);
    } else {
      console.error('User ID is not available');
    }
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Portal</h1>
      <p className="mb-4">
        Enter your user ID in the URL query to access the dashboard.
      </p>

      <button
        onClick={handleViewDashboard}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!userId}
      >
        View Dashboard
      </button>

      {!userId && (
        <p className="mt-2 text-red-500">
          User ID is missing. Please provide a valid user ID in the URL query.
        </p>
      )}
    </div>
  );
}