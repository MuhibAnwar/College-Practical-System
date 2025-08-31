"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-blue-800 shadow-md py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between">
         {/* Logo + Title */}
         <div className="flex items-center space-x-3 text-white text-2xl md:text-3xl font-bold mb-4 sm:mb-0">
           <Image src="/1.png" alt="dj" width={50} height={50} />
          <p className="text-2xl">DJ-CS RECORDS</p>
         </div>
   
         {/* Navigation Links */}
         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
           <a href="/add-student" className="text-white text-base font-medium hover:text-gray-200 transition duration-200">Add Student</a>
           <a href="/attendence" className="text-white text-base font-medium hover:text-gray-200 transition duration-200">Attendance</a>
           <a href="/student" className="text-white text-base font-medium hover:text-gray-200 transition duration-200">Record</a>
           <a href="/practicals" className="text-white text-base font-medium hover:text-gray-200 transition duration-200">Submissions</a>
         </div>
       </nav>
  );
}
