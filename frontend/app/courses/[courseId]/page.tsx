'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams, usePathname } from 'next/navigation';
import ModuleSidebar from 'components/ModuleSidebar';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import CourseSidebar from 'components/CourseSidebar';
import CreateModule from 'components/CreateModule';
import { get } from 'http';
import Navbar from 'components/Navbar';
import EditCourse from 'components/EditCourse';

type Forum = {
    _id: string;
};

export default function CourseDetailsPage() {
    axios.defaults.withCredentials = true
    const path = usePathname().split('/');

    const courseId = path[path.length - 1];

    const userId = getCookie('userId');
    const role = getCookie("role");
    const [course, setCourse] = useState<any>(null); // State to hold the course data
    const [forumId, setForumId] = useState('');
    const [moduleData , setModuleData] = useState([{
        "_id" : "",
        "title" : "",
        "content" : "",
    }]);
    const [error, setError] = useState("");
    const [loading , setLoading] = useState(true);
    const [enrolled , setEnrolled] = useState(false);
    const [refresh , setRefresh] = useState(true);

    const enrollStudent = async () => {
      const response = await axios.post('http://localhost:3001/courses/enroll/' + courseId , );
      
      console.log(response);
      setRefresh(true);
    }

    const deleteModule = async (moduleId : string) => {
      try {
        const response = await axios.delete('http://localhost:3001/modules/delete/' + moduleId , {withCredentials : true});

        // Update the module availability in the frontend
        setRefresh(true);
      } catch (error) {
        console.error("Error marking module as unavailable:", error);
      }
    };
    // Fetch course details on page load
    useEffect(() => {
        if(loading || refresh)
        {
          if(role === "student")
          {
            const fetchUserDetails = async () => {
              const response = await fetch('http://localhost:3001/users/fetchme' , {credentials : 'include'});
              const dataJson = await response.json();
              const userCourses = dataJson.courses;
              if(userCourses.includes(courseId))
              {
                setEnrolled(true);
              }
          };

          fetchUserDetails();
          }


              const fetchCourseDetails = async () => {
                if (!courseId) return;
        
                // Try fetching the course data from localStorage first
                const cachedCourse = localStorage.getItem(`course_${courseId}`);
                if (cachedCourse) {
                  setCourse(JSON.parse(cachedCourse));
                } else {
                  try {
                    const response = await axios.get(`http://localhost:3001/courses/${courseId}` , {withCredentials : true});
                    setCourse(response.data);
                    localStorage.setItem(`course_${courseId}`, JSON.stringify(response.data)); // Store in localStorage
                  } catch (error) {
                    console.error('Error fetching course details:', error);
                  }
                }
              };
  
              fetchCourseDetails();
  
              const fetchForum = async () => {
                try {
                const response = await axios.get(`http://localhost:3001/courses/forum/${courseId}` , {withCredentials : true });
                console.log("Forum fetched!!");
                  setForumId(response.data);
                } catch (error) {
                  setError("Failed to fetch forum.");
                  console.error(error);
                }
              };
  
              fetchForum();
  
              const fetchModules = async () => {
                try {
                const response = await fetch('http://localhost:3001/modules/getmodules/' + courseId , {credentials : 'include'});
                const dataJson = await response.json();
                setModuleData(dataJson);
                } catch (error) {
                  console.log(error);
                }
              }
  
              fetchModules();
            setRefresh(false);
            setLoading(false);
        }  
        
    }, [courseId , loading , refresh]);

    const forumReference = "http://localhost:3000/forum/" + forumId;

    console.log("Forum Id is: " + forumId);
    return (
        <>
        {loading?
         <>
         <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <p className="text-red-500 font-bold text-lg">Loading...</p>
          </div>
         </> 
         :
         <>
         <Navbar userId={userId}/>
         {role === "student" ?
         <>
             <div className="flex min-h-screen bg-gray-50">
              <CourseSidebar courseId={courseId} forumId={forumId} data={moduleData} enrolled={enrolled} />

            {/* Course Details Content */}
            <div className="course-details-content">
                <h1>{course?.title}</h1>
                <p>{course?.description}</p>
                <p><strong>Category:</strong> {course?.category}</p>
                <p><strong>Difficulty Level:</strong> {course?.difficulty_level}</p>
                <p><strong>Created By:</strong> {course?.created_by}</p>
                <p><strong>Created At:</strong> {new Date(course?.created_at).toLocaleDateString()}</p>
                {enrolled ? 
                <>
                </> 
                : 
                <>
                <button onClick={enrollStudent} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Enroll</button>
                 
                </>}
            </div>

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

         </> 
         :
         <>
            <div className="course-page-container flex">
            {/* Sidebar Container */}
            <CourseSidebar courseId={courseId} forumId={forumId} data={moduleData} enrolled={true} />

            {/* Course Details Content */}
            <div className="course-details-content">
                <h1>{course?.title}</h1>
                <p>{course?.description}</p>
                <p><strong>Category:</strong> {course?.category}</p>
                <p><strong>Difficulty Level:</strong> {course?.difficulty_level}</p>
                <p><strong>Created By:</strong> {course?.created_by}</p>
                <p><strong>Created At:</strong> {new Date(course?.created_at).toLocaleDateString()}</p>
                <section className="">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moduleData.map((module) => (
                <div key={module._id} className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition transform hover:scale-105">
                  <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                  <h3 className="text-xl font-semibold text-gray-800">{module.content}</h3>
                  <button onClick={() => deleteModule(module._id)}  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Delete</button>
                </div>
              ))}
            </div>
          </section>
                <EditCourse course_id={courseId} title={course?.title} description={course?.description} category={course?.category} difficulty_level={course?.difficulty_level} userId={userId} setRefresh={setRefresh} />
                <CreateModule courseId={courseId} setRefresh={setRefresh} />
            </div>

            

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
         </>}
         </>}
        </>
    );
};