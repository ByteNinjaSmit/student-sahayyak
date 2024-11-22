"use client";
import React, { useState, useEffect, Suspense } from "react";
import { FaQuestionCircle, FaFileAlt, FaSearch, FaPhoneAlt, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { toast } from "react-toastify";

const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState("form");
  const router = useRouter(); // Router instance for navigation
  const [trackId, setTrackId] = useState(""); // State to store complaint ID
  const [caseType, setCaseType] = useState(""); // State to store search parameter value
  const [isClient, setIsClient] = useState(false); // Flag to check if the component is on the client side

  // Set the client-side flag once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Access search parameters only after the component has mounted (client-side)
  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      const caseParam = searchParams.get('case');
      if (caseParam) {
        setActiveTab(caseParam);
      }
    }
  }, [isClient]);

  const handleTrackComplaint = async () => {
    if (!trackId) {
      toast.error("Please enter a valid complaint ID");
      return;
    }

    try {
      const response = await fetch(`/api/public/track-issue/valid/${trackId}`);
      if (response.ok) {
        router.push(`/contact/track-complaint/${trackId}`);
      } else {
        toast.error("Please enter a valid complaint ID.");
      }
    } catch (error) {
      toast.error("An error occurred while tracking the complaint.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "form":
        return (
          <div className="space-y-4">
            <Image
              src="https://media.istockphoto.com/photos/complaint-picture-id475991835?k=6&m=475991835&s=170667a&w=0&h=g6cSyjh5iSgBFxqdVTytnvXuHXP888W0Lkv-OAFT178="
              alt="Filling form"
              width={500} // Specify the image width
              height={200} // Specify the image height
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold">How to Fill the Grievance Form</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to your student portal</li>
              <li>Navigate to the &quot;Grievance&quot; section</li>
              <li>Click on &quot;Submit Your Complaint Now&quot;</li>
              <li>Fill out the grievance form, specifying your issue</li>
              <li>Upload any supporting images if necessary</li>
              <li>Review your submission and click &quot;Submit&quot;</li>
            </ol>
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
                value={trackId} // Bind the input to the state
                onChange={(e) => setTrackId(e.target.value)} // Update state on input change
                className="flex-grow px-4 py-2 border rounded-lg"
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleTrackComplaint} // Handle track button click
              >
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
                a: "Yes, all complaints must be submitted with valid student credentials are anonymous to the rector."
              },
              {
                q: "What types of grievances can I report?",
                a: "You can report all types of issues related to hostel facilities, mess, security, or any other hostel-related concerns."
              },
              {
                q: "What should i do if my issue is not resolved?",
                a: "If your issue isn't resolved in time, its severity will automatically increase, and it will be sent to a higher authority. Otherwise, you can file an 'action' on that issue."
              }
                ,
              {
                q: "Who review my grievance?",
                a: "First, the issue is reviewed by the hostel rector. If it isn't resolved, it is then transferred to the higher hostel authority."
              }
                ,
              {
                q: "Is there any limit to the number of complaint i can file?",
                a: "There is no limit, but please submit only genuine issues."
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
                <h4 className="font-semibold">Hostel Chief Warden : Pankaj Patil Sir</h4>
                <p>Phone: +91 9422370964</p>
                <p>Email: pankajpatil@sanjivanicoe.org.in</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">Hostel Clerk : Suralkar Sir</h4>
                <p>Phone: +91 9322447307</p>
                <p>Email: clerk@sanjivanicoe.org.in</p>
              </div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80"
              alt="Emergency contact"
              className="rounded-lg"
              width={1474}
              height={300} // Adjust height proportionally
              style={{ objectFit: 'cover', width: '100%', height: '12rem' }} // Tailwind won't work directly on `Image`
            />
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Us</h3>
            <Image
              src="https://media.istockphoto.com/vectors/young-man-outside-hostel-flat-vector-illustration-vector-id1191236486?k=6&m=1191236486&s=612x612&w=0&h=HAMwVDNKK6p9h5sYD5HMTsBjHdq0wyZK1499r52gZTw="
              alt="About Us"
              width={500} // Specify the image width
              height={300} // Specify the image height
              className="w-full h-48 object-cover rounded-lg"
            />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;Our mission is to ensure that each student has a comfortable and secure stay in the hostel. Through this system, we aim to make the grievance redressal process transparent, timely, and student-centric.
            </p>

            <p>
              &nbsp;&nbsp;&nbsp;&nbsp; Please feel free to utilize this platform for any complaints or concerns you may have. Your feedback is valuable to us in maintaining a positive and productive hostel environment.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-semibold">Help & Support</h1>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 ${activeTab === "form" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg`}
            onClick={() => setActiveTab("form")}
          >
            <FaQuestionCircle className="inline mr-2" /> Grievance Form
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "track" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg`}
            onClick={() => setActiveTab("track")}
          >
            <FaSearch className="inline mr-2" /> Track Complaint
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "faq" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg`}
            onClick={() => setActiveTab("faq")}
          >
            <FaFileAlt className="inline mr-2" /> FAQ
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "contact" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg`}
            onClick={() => setActiveTab("contact")}
          >
            <FaPhoneAlt className="inline mr-2" /> Emergency Contact
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "about" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg`}
            onClick={() => setActiveTab("about")}
          >
            <FaInfoCircle className="inline mr-2" /> About Us
          </button>
        </div>

        {renderContent()}
      </div>
    </Suspense>
  );
};

export default HelpSupportPage;
