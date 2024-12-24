'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import ModuleSidebar from 'components/ModuleSidebar';
import { getCookie } from 'cookies-next';
import Link from 'next/link';

type Forum = {
    _id: string;
};

export default function CourseDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId;

    const userId = getCookie('userId');
    const [course, setCourse] = useState<any>(null); // State to hold the course data
    const [forumId, setForumId] = useState('');
    const [error, setError] = useState("");

    // Fetch course details on page load
    useEffect(() => {
      const fetchCourseDetails = async () => {
        if (!courseId) return;

        // Try fetching the course data from localStorage first
        const cachedCourse = localStorage.getItem(`course_${courseId}`);
        if (cachedCourse) {
          setCourse(JSON.parse(cachedCourse));
        } else {
          try {
            const response = await axios.get(`http://localhost:3001/courses/${courseId}`);
            setCourse(response.data);
            localStorage.setItem(`course_${courseId}`, JSON.stringify(response.data)); // Store in localStorage
          } catch (error) {
            console.error('Error fetching course details:', error);
          }
        }
      };

      fetchCourseDetails();
    }, [courseId]);

    // Fetch forum ID
    useEffect(() => {
      const fetchForum = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/courses/forum/${courseId}`);
          setForumId(response.data);
        } catch (error) {
          setError("Failed to fetch forum.");
          console.error(error);
        }
      };

      if (courseId) {
        fetchForum();
      }
    }, [courseId]);

    const forumReference = "http://localhost:3000/forum/" + forumId;

    return (
        <div className="course-details-container flex">
            {/* Sidebar Container */}
            <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
                <div className="p-6 border-b border-gray-700 text-2xl font-bold">
                    Course Sidebar
                </div>
                <nav className="mt-6">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="/auth/dashboardS/student"
                                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Home Page 
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                📝 Modules
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={forumReference} // Correctly reference the forum ID
                                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                🌐 Forum
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Course Details Content */}
            <div className="course-details-content">
                <h1>{course?.title}</h1>
                <p>{course?.description}</p>
                <p><strong>Category:</strong> {course?.category}</p>
                <p><strong>Difficulty Level:</strong> {course?.difficulty_level}</p>
                <p><strong>Created By:</strong> {course?.created_by}</p>
                <p><strong>Created At:</strong> {new Date(course?.created_at).toLocaleDateString()}</p>
            </div>

            Forum iD is {forumId}

            <style jsx>{`
                .course-details-container {
                    display: flex;
                    justify-content: flex-start;
                    gap: 2rem;
                    padding: 2rem;
                    background-color: #f9f9f9;
                }

                .sidebar-container {
                    width: 300px;
                    background-color: #fff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 1rem;
                    border-radius: 8px;
                }

                .course-details-content {
                    flex-grow: 1;
                    background-color: #fff;
                    padding: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .course-details-content h1 {
                    font-size: 2.5rem;
                    color: #333;
                    margin-bottom: 1.5rem;
                }

                .course-details-content p {
                    font-size: 1.125rem;
                    line-height: 1.6;
                    color: #555;
                    margin-bottom: 1rem;
                }

                .course-details-content strong {
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .course-details-container {
                        flex-direction: column;
                        padding: 1rem;
                    }

                    .sidebar-container {
                        width: 100%;
                        margin-bottom: 2rem;
                    }

                    .course-details-content {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};
