'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter to handle navigation
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import "./app.css";
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import StudentSidebar from 'components/StudentSidebar';
import InstructorDashboard from 'app/auth/dashboardI/[instructorId]/page';
import InstructorSidebar from 'components/InstructorSidebar';
import CreateCourse from 'components/CreateCourse';
import { set } from 'mongoose';

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
    const [refresh , setRefresh] = useState(true);
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


                if(role === "student")
                {
                    let courses = await axios.get(`http://localhost:3001/courses/getAll`, { withCredentials: true });
                    console.log("All courses are: " + JSON.stringify(courses.data));
                    const studentData = await response.data.courses;
                    console.log("Student data is: " + JSON.stringify(studentData));
                    courses.data = courses.data.filter((course: any) => studentData.includes(course._id) );

                    console.log("Filtered courses are: " + JSON.stringify(courses.data));
                    setCourses(courses.data);
                }


                if(role === "instructor")
                {
                    let courses = await axios.get(`http://localhost:3001/courses/getAll`, { withCredentials: true });
                    console.log("All courses are: " + JSON.stringify(courses.data));

                    courses.data = courses.data.filter((course: any) => course.created_by === userId);

                    console.log("Filtered courses are: " + JSON.stringify(courses.data));
                    setCourses(courses.data);
                }

            } catch (error) {
                console.error('Error fetching user-specific courses:', error);
            }
        };

        if (userId && refresh) {
            fetchUserSpecificCourses();
            setRefresh(false);
        }

    }, [userId , refresh]);

    // Redirect to the course details page
    const navigateToCourseDetails = (courseId: string) => {
        router.push(`/courses/${courseId}`);
    };

    const deleteCourse = async (courseId: string) => {
        try {
            const response = await axios.delete(`http://localhost:3001/courses/${courseId}`, { withCredentials: true });
            console.log("Deleted course: " + response.data);
            toast.success("Course deleted successfully!");
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <>
        {role === "student" ? 
        <>
                <div className="course-page-container flex">
            {/* Sidebar */}
            <StudentSidebar />

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
        </> 
        : 
        <>
        {role === "instructor" ? 
        <>
        <div className="course-page-container flex">
        <InstructorSidebar />
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
                            <button onClick={() => navigateToCourseDetails(course._id)} className="details-button py-2">
                                View Course
                            </button>
                            <button onClick={() => deleteCourse(course._id)} className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                                Delete Course
                            </button>
                        </div>
                    ))}
                </div>
                <CreateCourse userId={userId} setRefresh={setRefresh} />
                <ToastContainer />
            </div>
        </div>
        </> 
        : 
        <></>}
        </>
        }
        </>
    );
};

export default CoursePage;
