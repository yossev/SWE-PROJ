'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter to handle navigation
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import "./app.css";
import { toast, ToastContainer } from 'react-toastify'; // Import toastify

const CoursePage = () => {
    axios.defaults.withCredentials = true;

    interface Course {
        _id: string;
        title: string;
        description: string;
        category: string;
        difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
        created_by: string;
        created_at: Date;
    }

    const [Courses, setCourses] = useState<Course[]>([]); 
    const [userCourses, setUserCourses] = useState<string[]>([]); 
    const [isStudent, setIsStudent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userId = getCookie('userId');
    const role = getCookie("role");
    interface CookieData {
        userId?: string;
        Token?: string;
    }

    

    const router = useRouter(); // Initialize useRouter for navigation

    // Consolidated useEffect to handle cookies, user role, and course fetching
    useEffect(() => {

        if (role === 'student') {
            setIsStudent(true);
        } else {
            setError('You are not authorized to view this page.');
        }

        // Fetch user-specific courses if user is logged in
        const fetchUserSpecificCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/fetch/${userId}`, { withCredentials: true });
                const user = response.data;
                const enrolledCourseIds = user.courses;

                if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
                    console.log('No courses found for this user');
                    return;
                }

                const courseResponses = await Promise.all(
                    enrolledCourseIds.map((courseId: any) =>
                        axios.get(`http://localhost:3001/courses/${courseId}`, { withCredentials: true })
                    )
                );

                const courses = courseResponses.map((response) => response.data);
                setCourses(courses);
            } catch (error) {
                console.error('Error fetching user-specific courses:', error);
            }
        };

        if (userId) {
            fetchUserSpecificCourses();
        }

    }, [userId]);

    // Redirect to the course details page
    const navigateToCourseDetails = (courseId: string) => {
        router.push(`/courses/${courseId}`);
    };

    return (
        <div className="course-page-container flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
                <div className="p-6 border-b border-gray-700 text-2xl font-bold">
                    Student Dashboard
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
                    </ul>
                </nav>
            </aside>

            <div className="course-content-container flex-grow p-6">
                <h1 className="title" style={{ marginTop: "1rem", marginBottom: "1rem", fontSize: "2rem", fontWeight: "bold" }}>Courses</h1>
                <div className="header-container"></div>

                <div className="course-cards-container">
                    {Courses.map(course => (
                        <div key={course._id} className="course-card">
                            <h3>{course.title}</h3>
                            <p>{course.category}</p>
                            <p>{course.difficulty_level}</p>
                            <p>{new Date(course.created_at).toLocaleDateString()}</p>
                            {/* "Details" button */}
                            <button onClick={() => navigateToCourseDetails(course._id)} className="details-button">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default CoursePage;
