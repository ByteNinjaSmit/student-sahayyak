"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import { FaBuilding, FaUtensils, FaTools, FaShieldAlt, FaExclamationCircle, FaCheckCircle, FaPencilAlt, FaQuestionCircle, FaHeadset, FaBook } from "react-icons/fa";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);


  const grievanceCategories = [
    { icon: <FaBuilding />, name: "Accommodation Issues", description: "Report problems related to rooms, furniture, or maintenance." },
    { icon: <FaUtensils />, name: "Food Quality", description: "Raise concerns about mess food quality or hygiene." },
    { icon: <FaTools />, name: "Facilities", description: "Report issues with common areas, utilities, or amenities." },
    { icon: <FaShieldAlt />, name: "Safety Concerns", description: "Notify about security issues or safety hazards." },
  ];

  const recentGrievances = [
    { title: "Broken AC in Room 302", status: "Pending", date: "2023-06-15" },
    { title: "Poor Food Quality in Mess", status: "Resolved", date: "2023-06-14" },
    { title: "Faulty Washing Machine", status: "Pending", date: "2023-06-13" },
  ];

  const statistics = [
    { label: "Total Grievances", value: 150, icon: <FaExclamationCircle /> },
    { label: "Resolved", value: 120, icon: <FaCheckCircle /> },
    { label: "Pending", value: 30, icon: <FaPencilAlt /> },
  ];

  const quickLinks = [
    { label: "FAQ", icon: <FaQuestionCircle /> },
    { label: "Contact Support", icon: <FaHeadset /> },
    { label: "Policy Guidelines", icon: <FaBook /> },
  ];
  

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">Dashboard</h1>
        <p className="text-xl text-gray-600 text-center">
          Welcome back, {user.user.username} to the Hostellers Grievance System
        </p>
      </header>


      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Grievance Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grievanceCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-blue-500">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                Raise a Grievance
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Recent Grievances</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentGrievances.map((grievance, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{grievance.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${grievance.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {grievance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{grievance.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <div className="text-4xl mr-4 text-blue-500">{stat.icon}</div>
              <div>
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className="flex items-center bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-xl mr-2 text-blue-500">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;