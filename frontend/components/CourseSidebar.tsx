import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { Dispatch , SetStateAction } from "react";

const CourseSidebar = ({forumId , data , enrolled} : {forumId : any , data : any , enrolled : boolean}) => {
  const userId = getCookie("userId");
  const [courses, setCourses] = useState([]);

  const forumReference = "http://localhost:3000/forum/" + forumId;
  useEffect(() => {
  }, []);
  
  return (
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
           {enrolled? 
           <>
            {data.map((module : any) => (
                <>
                    <li>
                        <Link
                        href={"http://localhost:3000/modules/" + module._id}
                        className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                        📝 {module.title}
                        </Link>
                    </li>
                </>
            ))}
            <li>
                <Link
                    href={forumReference} // Correctly reference the forum ID
                    className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    🌐 Forum
                </Link>
            </li>
           </>
           :
           <>
           </>}
        </ul>
    </nav>
</aside>
  )

}

export default CourseSidebar