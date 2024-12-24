import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";

const InstructorSidebar = () => {
  const userId = getCookie("userId");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
  }, []);

  return (
    <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
<div className="p-6 border-b border-gray-700 text-2xl font-bold">
  Instructor Sidebar
</div>
<nav className="mt-6">
  <ul className="space-y-4">
    <li>
      <Link
        href="#"
        className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        🔍 Search Student by Name
      </Link>
    </li>
    <li>
      <Link
        href="#"
        className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        ✉ Search Student by Email
      </Link>
    </li>
    <li>
      <Link
        href="#"
        className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        ✏ Update Personal Information
      </Link>
    </li>
  </ul>
</nav>
</aside>
  )

}

export default InstructorSidebar