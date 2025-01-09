"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, Save, RefreshCw } from "lucide-react";
import { useSession } from "@/app/store/session";
import { FaArrowLeft } from "react-icons/fa";

import { useRouter, useParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
const statusOptions = [
    { value: "Present", label: "Present", color: "bg-green-500" },
    { value: "Absent", label: "Absent", color: "bg-red-500" },
    { value: "Leave", label: "Leave", color: "bg-yellow-500" },
    { value: "Late", label: "Late", color: "bg-blue-500" },
];


interface Student {
    student: string | { name: string; room: string };
    status: any | "Present" | "Leave" | "Absent" | "Late";
    remarks: string;
    _id: string;
}

interface AttendanceRecord {
    _id: string;
    date: string;
    hostel: string;
    students: Student[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

type AttendanceData = Record<string, string>; // studentId => status

export default function Component() {
    const { userData, isLoggedIn } = useSession();
    const { admin } = useParams();
    const router = useRouter();
    const [isRector, setIsRector] = useState(false);
    const [mockStudents, setMockStudents] = useState<AttendanceData[]>([]);
    const [selectedRoom, setSelectedRoom] = useState("All Rooms");
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
    const [isFloorOpen, setIsFloorOpen] = useState(false);
    const [attendanceFilter, setAttendanceFilter] = useState("");
    const [isRoomOpen, setIsRoomOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [statusFilter, setStatusFilter] = useState("");
    const [newData, setNewData] = useState<AttendanceRecord[]>([]);

    const [loading, setLoading] = useState(false);
    // Fetching Students Particular Hostel
    const getmockStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/admin/users/${admin}/${userData?.hostelId}`
            );
            if (response.status === 200) {
                const data = response.data;
                setMockStudents(data); // Set fetched complaints
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    // console.log(newData);

    // GET Attendance Data
    const getAttendanceData = async () => {
        // console.log("user data",userData);

        // console.log(userData?.hostelId);

        if (!userData?.hostelId || !selectedDate) {
            console.log("Hostel ID or Selected Date is missing.");
            return;
        }

        try {
            const response = await axios.get(
                `/api/admin/attendance/${userData?.hostelId}/2024-11-29`
            );

            if (response.status === 200) {
                const data = response.data;
                setNewData(data); // Update the state with fetched attendance data
            }
        } catch (error) {
            console.error("Error Fetching Attendance:", error);
        }
    };

    // Extracting unique room numbers
    const uniqueRooms = new Set(
        mockStudents.map((student: any) => student?.room)
    );
    const rooms = Array.from(uniqueRooms);
    // Assuming `newData` contains the attendance and status for each student
    const filteredStudents = mockStudents.filter((student: any) => {
        // Find the corresponding attendance status from newData
        const studentAttendance: any = (newData as any)?.students?.find(
            (entry: any) => entry.student === student._id
        );

        const isInSelectedRoom =
            selectedRoom === "All Rooms" || student?.room === selectedRoom;

        // Attendance status from newData or "remaining" if not found
        const status = studentAttendance ? studentAttendance?.status : "remaining";

        // Fixed statusMatch to correctly check if the status matches the statusFilter
        const isStatusMatch = statusFilter ? status === statusFilter : true;

        // Filter by attendance filter (attended = "Present", "Leave", or "Late")
        const isAttendanceMatch =
            attendanceFilter === "attended"
                ? ["Present", "Leave", "Late", "Absent"].includes(status) // Match any of these statuses
                : attendanceFilter === "remaining"
                    ? status === "remaining" // Only show those marked as remaining
                    : true;

        return (
            isInSelectedRoom &&
            (student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student?.room.includes(searchQuery)) &&
            isStatusMatch &&
            isAttendanceMatch
        );
    });

    const calculateSummary = () => {
        const summary: { [key: string]: any } = {
            Present:
                (newData as any)?.students?.filter((s: any) => s.status === "Present")
                    .length || 0,
            Absent:
                (newData as any)?.students?.filter((s: any) => s.status === "Absent")
                    .length || 0,
            Leave:
                (newData as any)?.students?.filter((s: any) => s.status === "Leave").length ||
                0,
            Late:
                (newData as any)?.students?.filter((s: any) => s.status === "Late").length ||
                0,
        };

        Object.values(attendanceData)?.forEach((status) => {
            // Safely increment the correct status counter
            if (status in summary) {
                summary[status] = (summary[status] || 0) + 1;
            }
        });

        return summary;
    };

    const summary = calculateSummary();

    useEffect(() => {
        getmockStudents();
        getAttendanceData();
    }, [userData]);

    const searchStudentData = (id: any) => {
        // Ensure newData and newData.students are properly defined and an array
        if (Array.isArray((newData as any)?.students) && (newData as any)?.students.length === 0) {
            return null;
        }

        // Find the student with the given ID
        const result = (newData as any)?.students?.find((student :any) => student.student === id);
        if (!result) {
            return null;
        }
        // Return the found student data or null if not found
        return result || null;
    };

    const getStatusColor = (status:any) => {
        switch (status) {
            case "Present":
                return "text-green-600";
            case "Absent":
                return "text-red-600";
            case "Leave":
                return "text-yellow-600";
            case "Late":
                return "text-orange-600";
            default:
                return "text-red-900";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl p-4 text-center justify-center mb-0">
                    Hostel Attendance Management
                </h1>
                <Link
                    href="/admin/overview-attendance"
                    className="flex items-center justify-end p-2 mt-0 mx-auto"
                >
                    <h1 className="flex items-center justify-end text-blue-900 text-xl sm:text-xs lg:text-sm">
                        <FaArrowLeft className="mr-2" /> Go Back
                    </h1>
                </Link>
                {loading && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
                    </div>
                )}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Keep this for potential future use
                        className="w-full rounded-md border border-gray-300 px-3 py-2 sm:w-auto"
                        max={selectedDate} // Restrict the selection to today
                        min={selectedDate} // Restrict the selection to today
                        readOnly // Make it read-only to prevent user modification
                    />

                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={() => setIsRoomOpen(!isRoomOpen)}
                            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto"
                        >
                            {selectedRoom}
                            {isRoomOpen ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                        </button>
                        {isRoomOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg sm:w-48">
                                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                                    <li
                                        onClick={() => {
                                            setSelectedRoom("All Rooms"); // Set to "All Rooms"
                                            setIsRoomOpen(false);
                                        }}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                    >
                                        All Rooms
                                    </li>
                                    {rooms.map((room) => (
                                        <li
                                            key={room}
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setIsRoomOpen(false);
                                            }}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        >
                                            {room}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {/* Status Filter Dropdown */}
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 sm:w-auto"
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="relative w-full sm:w-auto">
                        <select
                            onChange={(e) => setAttendanceFilter(e.target.value)}
                            value={attendanceFilter}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="">All Students</option>
                            <option value="attended">Attended Students</option>
                            <option value="remaining">Remaining Students</option>
                        </select>
                    </div>
                </div>

                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
                    <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Attendance Sheet Of {userData?.hostelId}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="border-b text-left text-sm font-medium text-gray-500">
                                    <th className="pb-2 pr-4">Name</th>
                                    <th className="pb-2 pr-4">Room</th>
                                    <th className="pb-2 pr-4">Status</th>
                                    <th className="pb-2 ">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents?.map((student, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 pr-4 text-sm">{student?.name}</td>
                                        <td className="py-3 pr-4 text-sm">{student?.room}</td>
                                        <td
                                            className={`py-3 text-sm ${getStatusColor(
                                                searchStudentData(student?._id)?.status
                                            )}`}
                                        >
                                            {searchStudentData(student?._id)?.status || "Remain"}
                                        </td>
                                        <td
                                            className={`${searchStudentData(student?._id)?.status === "Present" ||
                                                    searchStudentData(student?._id)?.status === "Leave"
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                } py-3 text-sm`}
                                        >
                                            <Link
                                                href={`/admin/${admin}/overview-attendance/attendance/new/${student?._id}/${userData?.hostelId}/${selectedDate}`}
                                            >
                                                <button
                                                    className="py-2 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                                                    disabled={
                                                        searchStudentData(student?._id)?.status ===
                                                        "Present" ||
                                                        searchStudentData(student?._id)?.status === "Leave"
                                                    }
                                                >
                                                    Mark Attendance
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 sm:flex sm:space-x-4 lg:space-x-8">
                        {Object.entries(summary).map(([status, count]) => (
                            <div key={status} className="text-center">
                                <div className="text-2xl font-bold lg:text-3xl">{count}</div>
                                <div className="text-sm text-gray-500 capitalize lg:text-base">
                                    {status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
