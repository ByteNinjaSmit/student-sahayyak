'use client'
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronDown, FaEye, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { format } from 'date-fns';
import AdminSidebar from "@/components/layout/admin/sidebar";
import { useParams } from "next/navigation";
import Link from 'next/link';
import { useSession } from "@/app/store/session";
import { toast } from 'react-toastify';


export default function HostelAttendanceOverview() {
    const [date, setDate] = useState<Date | null>(null);
    const [hostel, setHostel] = useState<string>('All');
    const [showCalendar, setShowCalendar] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { admin } = useParams();
    const [attendanceData, setAttendanceData] = useState(null);
    const { userData, isLoggedIn } = useSession();
    const [loading, setLoading] = useState(false);

    const [isRector, setIsRector] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const toggleNotifications = () => setNotificationsOpen((prev) => !prev);
    // Mock data for demonstration
    // const attendanceData = [
    //     { id: 1, date: '2023-10-26', hostel: 'A1', present: 45, absent: 5, leave: 2, late: 3 },
    //     { id: 2, date: '2023-10-26', hostel: 'A2', present: 50, absent: 2, leave: 1, late: 2 },
    //     { id: 3, date: '2023-10-25', hostel: 'A1', present: 48, absent: 3, leave: 1, late: 3 },
    //     { id: 4, date: '2023-10-25', hostel: 'A2', present: 49, absent: 3, leave: 2, late: 1 },
    // ];

    // Fetch data From API
    const getAllAttendance = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/attendance`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                // Check the status to handle different error cases
                const errorMessage = response.status === 404
                    ? "Attendance data not found."
                    : "An error occurred while fetching attendance data.";
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setAttendanceData(data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllAttendance();
    }, []);
    const filteredData = attendanceData?.filter(entry =>
        (hostel === 'All' || entry.hostel === hostel) &&
        (!date || entry.date === format(date, 'yyyy-MM-dd'))
    );

    useEffect(() => {
        if (isLoggedIn && userData) {
            // Check if the user is an admin
            if (userData.isRector || userData.isHighAuth) {
                if (userData.isRector) {
                    setIsRector(true);
                    // console.log("this is Rector");
                }
            }
        } else {
            setIsRector(false); // Clear admin status if not logged in
        }
    }, [isLoggedIn, userData]);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            //   hour: "2-digit",
            //   minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    console.log(attendanceData);



    return (
        <div className="min-h-screen flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
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
                <header className="mx-auto mt-4 text-start justify-start">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Hostel Attendance Overview</h1>
                    <p className="text-sm sm:text-base text-center text-gray-600">Manage and view attendance for all hostels.</p>
                </header>
                {
                    !!isRector && (<div className="mb-6 sm:mb-8 lg:mb-12 p-4">

                        <Link href={`/admin/${admin}/overview-attendance/attendance`}>
                            <button className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105">
                                <FaCalendarAlt className="mr-2" />
                                Take Today's Attendance
                            </button>
                        </Link>

                    </div>)
                }


                <div className="mb-6 sm:mb-8 lg:mb-12 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4 p-6 ">
                    {!isRector && (
                        <div className="flex-1">
                            <label htmlFor="hostel-select" className="block text-sm font-medium mb-1 text-gray-700">Hostel</label>
                            <div className="relative">
                                <select
                                    id="hostel-select"
                                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    value={hostel}
                                    onChange={(e) => setHostel(e.target.value)}
                                >
                                    <option value="All">All Hostels</option>
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="A3">A3</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <FaChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="flex-1">
                        <label htmlFor="date-select" className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                        <div className="relative">
                            <button
                                id="date-select"
                                className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                {date ? format(date, "PPP") : "Pick a date"}
                            </button>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FaCalendarAlt className="h-4 w-4" />
                            </div>
                            {showCalendar && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                    <div className="p-2">
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded"
                                            onChange={(e) => {
                                                setDate(new Date(e.target.value));
                                                setShowCalendar(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-300 ease-in-out">
                        <FaCalendarAlt className="mr-2" />
                        Apply Filters
                    </button>
                </div>
                <div className="flex flex-col p-6 ">
                    <div className="overflow-x-auto ">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    {!isRector && (
                                        <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hostel</th>
                                    )}
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Present</th>
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Absent</th>
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave</th>
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Late</th>
                                    <th className="py-2 px-3 sm:px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData?.length === 0 ? (
                                    <tr>
                                        <td colSpan={isRector ? 6 : 7} className="py-4 px-3 sm:px-4 text-center text-sm text-gray-500">
                                            No data available.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData?.map((entry, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{formatDate(entry.date)}</td>
                                            {!isRector && (
                                                <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{entry.hostel}</td>
                                            )}
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{entry?.students?.filter(s => s.status === 'Present').length}</td>
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{entry?.students?.filter(s => s.status === 'Absent').length}</td>
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{entry?.students?.filter(s => s.status === 'Leave').length}</td>
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">{entry?.students?.filter(s => s.status === 'Late').length}</td>
                                            <td className="py-2 px-3 sm:px-4 whitespace-nowrap text-sm">
                                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                                    <Link href={`/admin/${admin}/overview-attendance/view/${entry?._id}`}>
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center justify-center transition duration-300 ease-in-out">
                                                            <FaEye className="mr-1" /> View
                                                        </button>
                                                    </Link>
                                                    <Link href={`/admin/${admin}/overview-attendance/edit/${entry?._id}`}>
                                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center justify-center transition duration-300 ease-in-out">
                                                        <FaEdit className="mr-1" /> Edit
                                                    </button>
                                                    </Link>

                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
                    <div className="flex space-x-2">
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l flex items-center transition duration-300 ease-in-out">
                            <FaChevronLeft className="mr-2" /> Previous
                        </button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r flex items-center transition duration-300 ease-in-out">
                            Next <FaChevronRight className="ml-2" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing 1 to {filteredData?.length} of {filteredData?.length} entries
                    </div>
                </div>
            </div>
        </div>
    );
}
