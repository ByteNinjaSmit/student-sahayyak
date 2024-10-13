"use client";
import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaComment,
  FaTrash,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const GrievanceView = () => {
  const { id } = useParams(); // Get the single issue ID from the URL params
  const router = useRouter(); // Initialize router for navigation
  const [grievance, setGrievance] = useState(null); // Initialize state to hold grievance data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [category, setCategory] = useState(null);
  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await fetch(
          `/api/issues/getissue/singleissue/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch grievance data");
        }
        const data = await response.json();
        setGrievance(data.document); // Set the fetched grievance data from document
        setCategory(data.category);
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchGrievance(); // Call the fetch function
  }, [id]); // Dependency array includes singleIssueId

  // Formatting function for dates
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetch fails
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-blue-600 py-6">
          <h1 className="text-3xl font-bold text-center text-white">
            Grievance Details
          </h1>
        </header>
        <div className="mb-6 text-center bg-yellow-200">
          <p className="text-2xl p-2 text-black font-bold ">
            Category:- {category}
          </p>
        </div>
        <div className="flex justify-end items-center mr-2">
          <Link href={`/`}>
            <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <IoMdArrowRoundBack className="mr-2" />
              Back to Home
            </button>
          </Link>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Grievance ID: {grievance._id}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Complaints:</h2>
            <ul className="list-disc pl-5">
              {grievance.complaint.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              User ID: {grievance.user._id}
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Created: {formatDate(grievance.createdAt)}
              </p>
              <p className="text-sm text-gray-600">
                Updated: {formatDate(grievance.updatedAt)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                grievance.status === "Resolved"
                  ? "bg-green-200 text-green-800"
                  : grievance.status === "Not Processed"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-200 text-blue-800"
              }`}
            >
              {grievance.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceView;
