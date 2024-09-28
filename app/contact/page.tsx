"use client";
import React, { useState } from "react";
import { FaQuestionCircle, FaFileAlt, FaSearch, FaPhoneAlt, FaInfoCircle, FaCog } from "react-icons/fa";

const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const renderContent = () => {
    switch (activeTab) {
      case "form":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How to Fill the Grievance Form</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to your student portal</li>
              <li>Navigate to the "Grievance" section</li>
              <li>Click on "New Grievance"</li>
              <li>Fill in all required fields with accurate information</li>
              <li>Upload any supporting documents if necessary</li>
              <li>Review your submission and click "Submit"</li>
            </ol>
            <img
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Filling form"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        );
      case "track":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Track Your Complaint</h3>
            <p>Enter your complaint ID to track its status:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Complaint ID"
                className="flex-grow px-4 py-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Track
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold">Status: In Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        );
      case "faq":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {[{
                  q: "How long does it take to process a grievance?",
                  a: "Typically, grievances are processed within 7-10 working days."
                },
                {
                  q: "Can I submit anonymous complaints?",
                  a: "No, all complaints must be submitted with valid student credentials."
                },
                {
                  q: "What types of grievances can I report?",
                  a: "You can report issues related to hostel facilities, mess, security, or any other hostel-related concerns."
                }
              ].map((item, index) => (
                <details key={index} className="bg-gray-100 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">{item.q}</summary>
                  <p className="mt-2">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">Hostel Warden</h4>
                <p>Phone: +1 234 567 8900</p>
                <p>Email: warden@college.edu</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">Security Office</h4>
                <p>Phone: +1 234 567 8901</p>
                <p>Email: security@college.edu</p>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80"
              alt="Emergency contact"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Us</h3>
            <p>
              The College Grievance System is designed to address and resolve issues faced by hostel residents efficiently. Our goal is to ensure a comfortable and safe living environment for all students.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold">Our Process:</h4>
              <ul className="list-disc list-inside mt-2">
                <li>Receive complaints</li>
                <li>Investigate issues</li>
                <li>Implement solutions</li>
                <li>Follow up with students</li>
              </ul>
            </div>
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="College campus"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        );
      case "troubleshoot":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Troubleshoot</h3>
            <div className="space-y-2">
              {[{
                  problem: "Unable to log in",
                  solution: "Reset your password or contact the IT department."
                },
                {
                  problem: "Grievance form not submitting",
                  solution: "Check your internet connection and try again. If the issue persists, clear your browser cache."
                },
                {
                  problem: "Cannot upload documents",
                  solution: "Ensure your file is in a supported format (PDF, JPG, PNG) and under 5MB in size."
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold">{item.problem}</h4>
                  <p>{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          {[{
              id: "form",
              icon: FaFileAlt,
              label: "How to Fill the Grievance Form"
            },
            {
              id: "track",
              icon: FaSearch,
              label: "Track Complaint"
            },
            {
              id: "faq",
              icon: FaQuestionCircle,
              label: "FAQ"
            },
            {
              id: "contact",
              icon: FaPhoneAlt,
              label: "Emergency Contact"
            },
            {
              id: "about",
              icon: FaInfoCircle,
              label: "About Us"
            },
            {
              id: "troubleshoot",
              icon: FaCog,
              label: "Troubleshoot"
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 w-full p-4 rounded-lg ${activeTab === item.id ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
