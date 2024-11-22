"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'; 
import { useSession } from "../store/session";

export default function Register() {
  const [username, setUsername] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useSession();

  const handleSubmit = async (e:any) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); 

    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, roomNumber, hostelName, password }),
      });

      const res_data = await response.json();

      if (response.ok) {
        // Store the token and log in the user
        router.push("/"); // Redirect to the home page
      } else {
        setError(res_data.error || "Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  // Redirect if the user is already logged in
  if (isLoggedIn) {
    router.push("/");
    return null; // Prevent rendering the form if logged in
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              id="roomNumber"
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Room Number"
              required
            />
          </div>

          <div>
            <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700">Hostel Name</label>
            <input
              id="hostelName"
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Hostel Name"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
            <input
              id="rePassword"
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Re-enter Password"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
