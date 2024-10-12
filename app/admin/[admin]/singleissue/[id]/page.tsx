"use client";
import React, { useState,useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
const GrievanceView = () => {
  const { admin, id } = useParams();
  const [status, setStatus] = useState("Not Processed");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLog, setActionLog] = useState([
    {
      actionType: "Complaint Filed",
      actionBy: "User",
      actionDate: "2023-06-01",
      remarks: "Initial complaint submission"
    }
  ]);

  const [complaintData,setComplaintData] = useState(null);
  const [category, setCategory] = useState(null);
  // Fetch data From 
  // /api/issues/getissue/singleissue/${id}
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
        setComplaintData(data.document); // Set the fetched grievance data from document
        setCategory(data.category);
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchGrievance(); // Call the fetch function
  }, [id]); // Dependency array includes singleIssueId
  console.log(`complaint Data: ${complaintData}`);
  

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (remarks.trim() === "") {
      alert("Please enter remarks before submitting.");
      return;
    }
    const newAction = {
      actionType: `Status updated to ${status}`,
      actionBy: "Admin",
      actionDate: new Date().toISOString().split("T")[0],
      remarks: remarks
    };
    setActionLog([...actionLog, newAction]);
    setRemarks("");
  };

    // Formatting function for dates
    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Grievance Detail</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Complaint ID: {`${complaintData?._id}`}</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Complaints:</h3>
            <ul className="list-disc list-inside text-gray-600">
            {complaintData?.complaint.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded">
            <span className="text-lg font-medium text-gray-700">Status: {complaintData?.status}</span>
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={complaintData?.status}
              onChange={handleStatusChange}
            >
              <option value="Not Processed">Not Processed</option>
              <option value="In Progress">In Progress</option>
              <option value="Urgent">Urgent</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-gray-600">
              <span className="font-medium">Username:</span> {complaintData?.user?.username}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Room Number:</span> {complaintData?.user?.room}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Hostel ID:</span> {complaintData?.user?.hostelId}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Action Log</h2>
          <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">{complaintData?.actionType}</span>
                  <span className="text-sm text-gray-500">{formatDate(complaintData?.createdAt)}</span>
                </div>
                <div className="text-gray-600">Action by: {complaintData?.actionBy}</div>
                {complaintData?.remarks && <div className="text-gray-600 mt-1">Remarks: {complaintData?.remarks}</div>}
              </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Action</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                Update Status
              </label>
              <select
                id="status"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="Not Processed">Not Processed</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="remarks" className="block text-gray-700 font-medium mb-2">
                Remarks
              </label>
              <textarea
                id="remarks"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={remarks}
                onChange={handleRemarksChange}
                placeholder="Enter your remarks here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
            >
              Submit Action
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrievanceView;