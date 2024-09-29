"use client";
import React, { useState } from "react";
import { FaHome, FaChartBar, FaUser, FaBed, FaUtensils, FaToolbox, FaShieldAlt, FaClipboardCheck, FaListAlt, FaInfoCircle, FaQuestionCircle, FaLifeRing } from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import AdminSidebar from "@/components/layout/admin/sidebar";
import Link from "next/link"; // Import the Link component for navigation

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

    const sidebarItems = [
        { icon: <FaHome />, text: "Home" },
        { icon: <FaChartBar />, text: "Overview" },
        { icon: <FaUser />, text: "Profile" },
        { icon: <FaBed />, text: "Hostel Issues" },
        { icon: <FaUtensils />, text: "Mess/Tiffin Issues" },
        { icon: <FaToolbox />, text: "Facilities Issues" },
        { icon: <FaShieldAlt />, text: "Security & Other Issues" },
        { icon: <FaClipboardCheck />, text: "Action" },
        { icon: <FaListAlt />, text: "Track Complaints" },
        { icon: <FaInfoCircle />, text: "About Us" },
        { icon: <FaQuestionCircle />, text: "FAQ" },
        { icon: <FaLifeRing />, text: "Help & Support" },
    ];

    const statisticsData = [
        { title: "Total Complaints", value: 150, color: "bg-blue-500", progress: 75 },
        { title: "Pending", value: 45, color: "bg-yellow-500", progress: 30 },
        { title: "Resolved", value: 95, color: "bg-green-500", progress: 63 },
        { title: "Urgent Issues", value: 10, color: "bg-red-500", progress: 20 },
    ];

    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Complaints",
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };

    const pieChartData = {
        labels: ["Pending", "Resolved"],
        datasets: [
            {
                data: [45, 95],
                backgroundColor: ["#FFCE56", "#36A2EB"],
                hoverBackgroundColor: ["#FFCE56", "#36A2EB"],
            },
        ],
    };

    const barChartData = {
        labels: ["Hostel", "Mess", "Facilities", "Security", "Other"],
        datasets: [
          {
            label: "Complaints",
            data: [65, 59, 80, 81, 56],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      };

    // const barChartData = {
    //     labels: ["Hostel", "Mess", "Facilities", "Security", "Other"],
    //     datasets: [
    //         {
    //             label: "Grievances by Category",
    //             data: [65, 59, 80, 81, 56],
    //             backgroundColor: "rgba(54, 162, 235, 0.6)",
    //         },
    //     ],
    // };

    const recentGrievances = [
        { id: "GR001", category: "Hostel", userName: "John Doe", status: "Pending" },
        { id: "GR002", category: "Mess", userName: "Jane Smith", status: "Resolved" },
        { id: "GR003", category: "Facilities", userName: "Bob Johnson", status: "Urgent" },
        { id: "GR004", category: "Security", userName: "Alice Brown", status: "In Progress" },
    ];

    const actionLog = [
        { action: "Resolved GR002", admin: "Admin1", timestamp: "2023-06-15 10:30 AM" },
        { action: "Escalated GR004", admin: "Admin2", timestamp: "2023-06-15 11:45 AM" },
        { action: "Responded to GR001", admin: "Admin1", timestamp: "2023-06-15 02:15 PM" },
    ];

    const notifications = [
        { id: 1, message: "New complaint received (GR005)" },
        { id: 2, message: "Urgent issue reported in Hostel Block A" },
        { id: 3, message: "Complaint GR002 has been resolved" },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                    <button
                        className="text-gray-500 focus:outline-none lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 6H20M4 12H20M4 18H11"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div className="relative">
                        <button
                            className="flex items-center text-gray-500 focus:outline-none"
                            onClick={toggleNotifications}
                        >
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                                <div className="py-2">
                                    <div className="px-4 py-2 text-gray-800 font-semibold bg-gray-100">
                                        Notifications
                                    </div>
                                    {notifications.map((notification) => (
                                        <a
                                            key={notification.id}
                                            href="#"
                                            className="flex items-center px-4 py-3 hover:bg-gray-100 -mx-2"
                                        >
                                            <p className="text-gray-600 text-sm mx-2">
                                                {notification.message}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>

                        {/* Statistics Cards */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statisticsData.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`p-3 rounded-full ${stat.color} text-white mr-4`}
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-gray-600">
                                                {stat.title}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-700">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${stat.color} rounded-full h-2`}
                                                style={{ width: `${stat.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h4 className="text-xl font-semibold mb-4">Complaints Overview</h4>
                                <Line data={lineChartData} />
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h4 className="text-xl font-semibold mb-4">Status Breakdown</h4>
                                <Pie data={pieChartData} />
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                                <h4 className="text-xl font-semibold mb-4">Top Categories</h4>
                                <Bar data={barChartData} />
                            </div>
                        </div>

                        {/* Recent Grievances Table */}
                        <div className="mt-8">
                            <h4 className="text-xl font-semibold mb-4">Recent Grievances</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3">Grievance ID</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">User Name</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentGrievances.map((grievance) => (
                                            <tr key={grievance.id} className="border-b hover:bg-gray-50 bg-white">
                                                <td className="p-3">{grievance.id}</td>
                                                <td className="p-3">{grievance.category}</td>
                                                <td className="p-3">{grievance.userName}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${grievance.status === "Resolved"
                                                                ? "bg-green-200 text-green-800"
                                                                : grievance.status === "Urgent"
                                                                    ? "bg-red-200 text-red-800"
                                                                    : "bg-yellow-200 text-yellow-800"
                                                            }`}
                                                    >
                                                        {grievance.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Action Log */}
                        <div className="mt-8">
                            <h4 className="text-xl font-semibold mb-4">Action Log</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3">Action</th>
                                            <th className="p-3">Admin</th>
                                            <th className="p-3">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {actionLog.map((log, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50 bg-white">
                                                <td className="p-3">{log.action}</td>
                                                <td className="p-3">{log.admin}</td>
                                                <td className="p-3">{log.timestamp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;