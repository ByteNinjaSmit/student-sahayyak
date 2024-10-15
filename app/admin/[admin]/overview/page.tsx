"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaSync, FaSort } from "react-icons/fa";
import AdminSidebar from "@/components/layout/admin/sidebar";
import { useParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const GrievanceManagementSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleNotifications = () => setNotificationsOpen((prev) => !prev);
  const { admin } = useParams();
  // Dummy data for demonstration
  // const grievances = [
  //   { id: "GR001", category: "Technical", userName: "John Doe", status: "Open" },
  //   { id: "GR002", category: "HR", userName: "Jane Smith", status: "In Progress" },
  //   { id: "GR003", category: "Financial", userName: "Mike Johnson", status: "Closed" },
  //   // ... more grievances
  // ];

  // Function to fetch complaints
 
  const getComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/issues/getissue/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setGrievances(data); // Set fetched complaints
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplaints();
  }, [admin]);

  const itemsPerPage = 50;
  const totalPages = Math.ceil(grievances.length / itemsPerPage);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);

  const filteredGrievances = grievances.filter((grievance) => {
    return (
      (grievance._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grievance.user?.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (category === "All" || grievance.category === category) &&
      (status === "All" || grievance.status === status)
    );
  });

  const paginatedGrievances = filteredGrievances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 to-green-100">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="relative">
            <button
              className="flex items-center text-gray-500 focus:outline-none"
              onClick={toggleNotifications}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-4 py-2 text-gray-800 font-semibold bg-gray-100">
                    Notifications
                  </div>
                  {/* Notification items */}
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="mx-auto mt-4 text-start justify-start">
          <h3 className="text-3xl font-medium text-gray-700 text-start">Grievance Management : Overview</h3>
        </div>
        
        {loading && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
            </div>
          )}

        <div className="flex-1 container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID or Name"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="flex space-x-4">
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="All">All Categories</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Mess / Tiffin">Mess / Tiffin</option>
                  <option value="Facility">Facility</option>
                  <option value="Security">Security</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="All">All Statuses</option>
                  <option value="Not Processed">Not Processed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Proceeded">Proceeded</option>
                  <option value="Not Resolved">Not Resolved</option>
                  <option value="Resolved">Resolved</option>


                </select>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center">
                  <FaFilter className="mr-2" /> Apply Filters
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center">
                  <FaSync className="mr-2" /> Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Grievance ID <FaSort className="inline ml-1 cursor-pointer" /></th>
                    <th className="px-4 py-2 text-left">Category <FaSort className="inline ml-1 cursor-pointer" /></th>
                    <th className="px-4 py-2 text-left">User Name <FaSort className="inline ml-1 cursor-pointer" /></th>
                    <th className="px-4 py-2 text-left">Status <FaSort className="inline ml-1 cursor-pointer" /></th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGrievances.map((grievance) => (
                    <tr key={grievance._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{grievance._id}</td>
                      <td className="px-4 py-2">{grievance.category}</td>
                      <td className="px-4 py-2">{grievance.user?.username}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                grievance.status === "Resolved"
                                  ? "bg-green-200 text-green-800"
                                  : grievance.status === "Urgent"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                              }`}>
                          {grievance.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-blue-500 hover:text-blue-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceManagementSystem;