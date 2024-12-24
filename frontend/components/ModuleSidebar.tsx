"use client"

import React, { useState } from 'react'
import Link from "next/link";

const ModuleSidebar = ({courseId , data} : {courseId : string , data : any}) => { 
    const [open , setOpen] = useState(false);
    let counter : number = 1;
    const handleClick = () => {
        setOpen(!open);
    }

    const reference = "http://localhost:3000/course/" + courseId;
    return (
        <aside className="w-64 bg-gradient-to-br from-gray-900 to-red-900 text-white shadow-lg"> 
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">
          Module Sidebar
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            {data.map((quiz : any) => (
              <>
                <li>
                  <Link
                  href={"http://localhost:3000/quiz/start/" + quiz._id}
                  className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
                    📝 {"Quiz #" + counter++}
                  </Link>
                </li>
              </>
                
            ))}
            <li>
              <Link
                href={reference}
                className="block w-full text-left py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                📚 Return to Course
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

    )
}

export default ModuleSidebar;