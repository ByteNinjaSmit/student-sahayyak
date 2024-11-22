'use client'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search, Save, RefreshCw } from 'lucide-react'
import { useSession } from "@/app/store/session";
import { useRouter, useParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from 'react-toastify';

// Define the structure for Student data
interface Student {
    _id: string;
    name: string;
    room: string;
}

interface AttendanceData {
    createdAt: string;
    hostel: string;
    students: { student: Student, status: string }[];
}

const statusOptions = [
    { value: 'Present', label: 'Present', color: 'bg-green-500' },
    { value: 'Absent', label: 'Absent', color: 'bg-red-500' },
    { value: 'Leave', label: 'Leave', color: 'bg-yellow-500' },
    { value: 'Late', label: 'Late', color: 'bg-blue-500' },
]
export default function Component() {
    const { userData, isLoggedIn } = useSession();
    const { admin, id } = useParams();
    const router = useRouter();
    const [isRector, setIsRector] = useState(false);
    const [mockStudents, setMockStudents] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('All Rooms')
    const [searchQuery, setSearchQuery] = useState('')
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [isFloorOpen, setIsFloorOpen] = useState(false)
    const [attendanceFilter, setAttendanceFilter] = useState('');
    const [isRoomOpen, setIsRoomOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetching data From database Of the Attendance
    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin/attendance/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAttendanceData(data);
                }
                if (!response.ok) {
                    toast.error('Error fetching attendance data')
                }
            } catch (error) {

            } finally {
                setLoading(false);
            }
        }
        fetchAttendanceData();
    }, []);
    // Extracting unique room numbers
    // Ensure attendanceData is an array to avoid errors
    const uniqueRooms = new Set(attendanceData?.students?.map((student) => student?.student?.room).filter(Boolean));
    const rooms = Array.from(uniqueRooms);

    // Update the filteredStudents logic
    const filteredStudents = attendanceData?.students?.filter((students) => {
        // Check if selectedRoom is 'All Rooms' or if the student's room matches the selected room
        const isInSelectedRoom = selectedRoom === 'All Rooms' || students?.student?.room === selectedRoom;

        // Ensure attendanceData is in the expected format, checking against the status and attendance filters
        const isStatusMatch = statusFilter ? students?.status === statusFilter : true;

        // Return true if all conditions match (room, status, attendance, and search)
        return (
            isInSelectedRoom &&
            (students?.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            students?.student?.room.includes(searchQuery)) &&
            isStatusMatch 
        );
    }) || [];

    useEffect(() => {
        const handleBeforeUnload = (event:any) => {
            // Customize the alert message
            event.preventDefault();
            event.returnValue = 'If you reload, your data will be lost!';
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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
    }, [isLoggedIn, userData, admin]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'text-green-600';
            case 'Absent': return 'text-red-600';
            case 'Leave': return 'text-yellow-600';
            case 'Late': return 'text-orange-600';
            default: return '';
        }
    };

    // Format Data Function
    const formatDate = (dateString:any) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options as any);
      };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">Hostel Attendance Management</h1>
                {loading && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
                    </div>
                )}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                    <div className='w-full rounded-md border border-gray-300 px-3 py-2 sm:w-auto'>
                        {formatDate(attendanceData?.createdAt)}
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={() => setIsRoomOpen(!isRoomOpen)}
                            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto"
                        >
                            {selectedRoom}
                            {isRoomOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </button>
                        {isRoomOpen && (
                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg sm:w-48">
                                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                                    <li
                                        onClick={() => {
                                            setSelectedRoom('All Rooms'); // Set to "All Rooms"
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
                        <h2 className="text-xl font-semibold text-gray-800">Attendance Sheet Of {attendanceData?.hostel}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b text-left text-sm font-medium text-gray-500">
                                    <th className="pb-2 pr-4">Name</th>
                                    <th className="pb-2 pr-4">Room</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((students, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 pr-4">{students?.student?.name}</td>
                                        <td className="py-3 pr-4">{students?.student?.room}</td>
                                        <td className={`py-3 pr-4 ${getStatusColor(students?.status)}`}>{students?.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 sm:flex sm:space-x-4 lg:space-x-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold lg:text-3xl">{attendanceData?.students?.filter(s => s.status === 'Present').length}</div>
                            <div className="text-sm text-gray-500 capitalize lg:text-base">Present</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold lg:text-3xl">{attendanceData?.students?.filter(s => s.status === 'Absent').length}</div>
                            <div className="text-sm text-gray-500 capitalize lg:text-base">Absent</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold lg:text-3xl">{attendanceData?.students?.filter(s => s.status === 'Leave').length}</div>
                            <div className="text-sm text-gray-500 capitalize lg:text-base">Leave</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold lg:text-3xl">{attendanceData?.students?.filter(s => s.status === 'Late').length}</div>
                            <div className="text-sm text-gray-500 capitalize lg:text-base">Late</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}