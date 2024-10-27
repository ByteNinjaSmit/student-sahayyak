"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaIdCardAlt, FaHome, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation"; // For client-side routing
import Link from "next/link";

const EditUserFromAdmin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [hostel, setHostel] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter(); // Navigation hook to redirect on successful update
    const { admin, user } = useParams();
    const [userData, setUserData] = useState(null);

    // Toggle password visibility
    const togglePasswordVisibility = (field: string) => {
        if (field === "password") setShowPassword(!showPassword);
        if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
    };

    // Fetch user data on component mount
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`/api/userdata/userinfo/${user}`);
                if (!response.ok) {
                    toast.error("Failed To Fetch Data Of User");
                    return;
                }
                const data = await response.json();
                setUserData(data.data);

                // Pre-populate the form fields with fetched data
                setName(data.data[0]?.name || "");
                setUsername(data.data[0]?.username || "");
                setRoomNumber(data.data[0]?.room || "");
                setHostel(data.data[0]?.hostelId || "");
            } catch (error) {
                toast.error("An error occurred while fetching user data.");
            }
        };

        getUser();
    }, [user]);

    // Handle Edit (PATCH request)
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Password and confirm password do not match.");
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${user}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    room: roomNumber,
                    hostelId: hostel,
                }),
            });

            if (!response.ok) {
                toast.error("Failed to update user information.");
                return;
            }

            const data = await response.json();
            toast.success(data.msg || "User updated successfully");
            router.push(`/admin/${admin}/hostellers`);
        } catch (error) {
            toast.error("An error occurred during the update.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-red-300 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8">
                <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">
                    Edit User
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Edit user information by filling in the fields below.
                </p>

                <form onSubmit={handleEdit}>
                    <div className="space-y-6">
                        <div className="bg-indigo-100 p-4 rounded-lg">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-indigo-700 mb-1"
                            >
                                <FaIdCardAlt className="inline mr-2" /> Username
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full px-3 py-2 border border-indigo-300 rounded-md bg-white text-indigo-800"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Your Name.."
                            />
                        </div>
                        <div className="bg-indigo-100 p-4 rounded-lg">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-indigo-700 mb-1"
                            >
                                <FaUser className="inline mr-2" /> Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-3 py-2 border border-indigo-300 rounded-md bg-white text-indigo-800"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter the username"
                            />
                        </div>

                        <div className="bg-pink-100 p-4 rounded-lg">
                            <label
                                htmlFor="roomNumber"
                                className="block text-sm font-medium text-pink-700 mb-1"
                            >
                                <FaHome className="inline mr-2" /> Room Number
                            </label>
                            <input
                                type="text"
                                id="roomNumber"
                                name="roomNumber"
                                className="w-full px-3 py-2 border border-pink-300 rounded-md bg-white text-pink-800"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                placeholder="Enter the room number"
                            />
                        </div>

                        <div className="bg-purple-100 p-4 rounded-lg">
                            <label
                                htmlFor="hostel"
                                className="block text-sm font-medium text-purple-700 mb-1"
                            >
                                <FaBuilding className="inline mr-2" /> Hostel
                            </label>
                            <input
                                type="text"
                                id="hostel"
                                name="hostel"
                                className="w-full px-3 py-2 border border-purple-300 rounded-md bg-white text-purple-800"
                                value={hostel}
                                onChange={(e) => setHostel(e.target.value)}
                                placeholder="Enter the hostel"
                            />
                        </div>

                        <div className="pt-6">
                            <h2 className="text-2xl font-semibold mb-4 text-red-600">
                                Set Password
                            </h2>
                            <div className="border-t border-red-400 mb-6"></div>

                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-green-700 mb-1"
                                    >
                                        <FaLock className="inline mr-2" /> Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="w-full px-3 py-2 border border-green-300 rounded-md pr-10 bg-white text-green-800"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility("password")}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-green-500" />
                                            ) : (
                                                <FaEye className="text-green-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-blue-700 mb-1"
                                    >
                                        <FaLock className="inline mr-2" /> Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full px-3 py-2 border border-blue-300 rounded-md pr-10 bg-white text-blue-800"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility("confirm")}
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="text-blue-500" />
                                            ) : (
                                                <FaEye className="text-blue-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200"
                        >
                            Submit Changes
                        </button>
                        <Link
                            href={`/admin/${admin}/hostellers`}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserFromAdmin;
