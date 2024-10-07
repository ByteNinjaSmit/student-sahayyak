"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/app/store/session";
import { useRouter, useParams } from "next/navigation";
import {
  FaUserCog,
  FaBuilding,
  FaUtensils,
  FaTools,
  FaShieldAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaPencilAlt,
  FaQuestionCircle,
  FaHeadset,
  FaBook,
} from "react-icons/fa";
import Link from "next/link";

const Dashboard = () => {
  const { isLoggedIn, userData } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const params = useParams<{ user: string }>();

  useEffect(() => {
    // Set user data on component mount
    setUserId(userData?._id);
    setUser(userData);

    // Fetch complaints data from API when the user is available
    if (userId) {
      getComplaints();
    }
  }, [isLoggedIn, userId]);

  // Function to fetch complaints
  const getComplaints = async () => {
    try {
      const response = await fetch(`/api/issues/getissue/${userId}/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplaintData(data); // Set fetched complaints
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const grievanceCategories = [
    {
      icon: <FaUserCog />,
      name: "Profile",
      description: "Click to view and edit your profile.",
      link: `/${params.user}/dashboard/edit-profile`,
      buttonText: "Edit",
    },
    {
      icon: <FaBuilding />,
      name: "Hostel Issues",
      description:
        "Report problems related to rooms, common-area, or maintenance of hostel.",
      link: `/${params.user}/issue/hostel`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaUtensils />,
      name: "Mess / Tiffin Issues",
      description: "Raise concerns about issues related to mess/tiffin.",
      link: `/${params.user}/issue/mess`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaTools />,
      name: "Issues in Facilities",
      description:
        "Report issues with facilies, utilities, or amenities such as drinking water , wifi connectivity.",
      link: `/${params.user}/issue/facilities`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaShieldAlt />,
      name: "Security and Other",
      description: "Notify about security issues or safety hazards.",
      link: `/${params.user}/issue/security`,
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaPencilAlt />,
      name: "Action",
      description: "Click if problem isn't resolved.",
      link: "/grievance/action",
      buttonText: "Raise a Grievance",
    },
    {
      icon: <FaCheckCircle />,
      name: "Track Complaint",
      description: "Click to check the status of your complaint.",
      link: "/grievance/track",
      buttonText: "Track",
    },
    {
      icon: <FaBook />,
      name: "About Us",
      description: "Click to see about us.",
      link: "/contact",
      buttonText: "View",
    },
    {
      icon: <FaQuestionCircle />,
      name: "Faq",
      description: "Click to see frequently asked questions.",
      link: "/faq",
      buttonText: "View",
    },
    {
      icon: <FaHeadset />,
      name: "Help and Support",
      description: "Click to get help.",
      link: "/contact",
      buttonText: "View",
    },
  ];

  const statistics = [
    { label: "Total Grievances", value: complaintData.length, icon: <FaExclamationCircle /> },
    { label: "Resolved", value: complaintData.filter(grievance => grievance.status === "Resolved").length, icon: <FaCheckCircle /> },
    { label: "Pending", value: complaintData.filter(grievance => grievance.status === "Not Processed").length, icon: <FaPencilAlt /> },
  ];
  

  const quickLinks = [
    { label: "FAQ", icon: <FaQuestionCircle />, link: "/faq" },
    { label: "Contact Support", icon: <FaHeadset />, link: "/support" },
    { label: "Policy Guidelines", icon: <FaBook />, link: "/policies" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 text-center">
          Welcome back, {user?.username} to the Hostellers Grievance System
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Grievance Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grievanceCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4 text-blue-500">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => router.push(category.link)}
              >
                {category.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Show Collected complaints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Recent Grievances
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Complaint Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaintData.length > 0 ? (
                complaintData.map((grievance, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Array.isArray(grievance.complaint) ? (
                        <ul className="list-disc list-inside">
                          {grievance.complaint.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        grievance.complaint
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grievance.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {grievance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(grievance.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/${userId}/issue/singleissue/${grievance._id}`}>
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={4}>
                    No recent grievances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex items-center"
            >
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
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl mr-4 text-blue-500">{link.icon}</div>
              <div>
                <p className="text-xl font-semibold">
                  <a href={link.link}>{link.label}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
