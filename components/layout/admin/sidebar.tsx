"use client";
import React from "react";
import Link from "next/link"; // Import the Link component for navigation
import {
  FaHome,
  FaChartBar,
  FaUser,
  FaBed,
  FaUtensils,
  FaToolbox,
  FaShieldAlt,
  FaClipboardCheck,
  FaListAlt,
  FaInfoCircle,
  FaQuestionCircle,
  FaLifeRing,
  FaTimes, // Import the close (times) icon
} from "react-icons/fa";

// Define the prop types
interface AdminSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const sidebarItems = [
    { icon: <FaHome />, text: "Home", href: "/admin/home" },
    { icon: <FaChartBar />, text: "Overview", href: "/admin/overview" },
    { icon: <FaUser />, text: "Profile", href: "/admin/profile" },
    { icon: <FaBed />, text: "Hostel Issues", href: "/admin/hostel-issues" },
    { icon: <FaUtensils />, text: "Mess/Tiffin Issues", href: "/admin/mess-issues" },
    { icon: <FaToolbox />, text: "Facilities Issues", href: "/admin/facilities-issues" },
    { icon: <FaShieldAlt />, text: "Security & Other Issues", href: "/admin/security-issues" },
    { icon: <FaClipboardCheck />, text: "Action", href: "/admin/action" },
    { icon: <FaListAlt />, text: "Track Complaints", href: "/admin/track-complaints" },
    { icon: <FaInfoCircle />, text: "About Us", href: "/admin/about" },
    { icon: <FaQuestionCircle />, text: "FAQ", href: "/admin/faq" },
    { icon: <FaLifeRing />, text: "Help & Support", href: "/admin/help-support" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 bg-blue-900 px-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            className="text-white lg:hidden"
            onClick={toggleSidebar} // Trigger close on click
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center px-6 py-3 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-200"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;