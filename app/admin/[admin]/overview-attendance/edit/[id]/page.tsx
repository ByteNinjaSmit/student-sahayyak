'use client'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search, Save, RefreshCw } from 'lucide-react'
import { useSession } from "@/app/store/session";
import { useRouter, useParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from 'react-toastify';

interface Student {
    _id: string;
    student: {
        _id:string;
        name: string;
        room: string;
        status:string;
    };
    status: string;
}

interface AttendanceData {
    students: Student[];
    createdAt: string;
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
    const [mockStudents, setMockStudents] = useState<Student[]>([]);
    const [selectedRoom, setSelectedRoom] = useState('All Rooms')
    const [searchQuery, setSearchQuery] = useState('')
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [isFloorOpen, setIsFloorOpen] = useState(false)
    const [attendanceFilter, setAttendanceFilter] = useState('');
    const [isRoomOpen, setIsRoomOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [statusFilter, setStatusFilter] = useState('');
    const [summary, setSummary] = useState<{ [key: string]: number }>({
        present: 0,
        absent: 0,
        late: 0,
    });
    const [loading, setLoading] = useState(false);
    const [attUpdatedData, setAttUpdatedData] = useState<Record<string, string>>({});
    // Fetching Students Particular Hostel
    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin/attendance/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAttendanceData(data);
                    const initialStatusData :Record<string, string>= {};
                    data?.students?.forEach((student:Student) => {
                        initialStatusData[student?.student?._id] = student?.status; // populate with existing statuses
                    });
                    setAttUpdatedData(initialStatusData);
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
    }, [id]);



    // Extracting unique room numbers
    const uniqueRooms = new Set(attendanceData?.students?.map((student) => student?.student?.room).filter(Boolean));
    const rooms = Array.from(uniqueRooms);
    // Update the filteredStudents logic
    const filteredStudents = attendanceData?.students.filter(student => {
        const isInSelectedRoom = selectedRoom === 'All Rooms' || student.student.room === selectedRoom;
        const isStatusMatch = statusFilter ? attUpdatedData[student._id] === statusFilter : true;

        return (
            isInSelectedRoom &&
            (student?.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || student?.student?.room?.includes(searchQuery)) &&
            isStatusMatch
        );
    }) || [];


    const handleAttendanceChange = (id: string, status: string) => {
        setAttUpdatedData((prev) => ({
            ...prev,
            [id]: status, // Update the state with the new status
        }));
        updateSummary(id, status); // Update summary based on the new status
    };

    const handleBulkAction = (status: any) => {
        const updatedData:any = {};
        filteredStudents?.forEach(student => {
            updatedData[student?.student?._id] = status;
        });
        setAttUpdatedData(prev => ({
            ...prev,
            ...updatedData,
        }));
    };

    const handleClearAll = () => {
        const clearedData:any = {};
        filteredStudents.forEach(student => {
            clearedData[student?.student?._id] = '';
        });
        setAttUpdatedData(prev => ({
            ...prev,
            ...clearedData,
        }));
    };

    // const calculateSummary = () => {
    //     const summary = {
    //         present: 0,
    //         absent: 0,
    //         leave: 0,
    //         late: 0,
    //     };
    //     Object.values(attUpdatedData).forEach(status => {
    //         if (status in summary) {
    //             summary[status]++;
    //         }
    //     });
    //     return summary;
    // };
    const updateSummary = (id: string, status: string) => {
        const prevStatus = attUpdatedData[id] || '';
        if (prevStatus) {
            setSummary((prev) => ({
                ...prev,
                [prevStatus]: prev[prevStatus] - 1, // Decrement previous status count
            }));
        }
        setSummary((prev) => ({
            ...prev,
            [status]: prev[status] + 1, // Increment new status count
        }));
    };


    // const summary = calculateSummary()
    //   When click on submit log data in console
    const handleSaveAttendance = async () => {
        const attendanceArray = Object.entries(attUpdatedData).map(([studentId, status]) => ({
            studentId,
            status,
        }));

        const attendanceLog = {
            date: selectedDate,
            attendanceList: attendanceArray,
        };



        try {
            const response = await fetch(`/api/admin/attendance/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    students: attendanceLog.attendanceList.map(item => ({
                        student: item.studentId,
                        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                        remarks: "",
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();
            toast.success(result.message);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            // toast.error(error.message);
        } finally {
            router.push(`/admin/${admin}/overview-attendance`);
        }
    };
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'text-green-600';
            case 'Absent': return 'text-red-600';
            case 'Leave': return 'text-yellow-600';
            case 'Late': return 'text-orange-600';
            default: return '';
        }
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
                        <h2 className="text-xl font-semibold text-gray-800">Attendance Sheet Of {userData?.hostelId}</h2>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                            <select
                                onChange={(e) => handleBulkAction(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-auto"
                            >
                                <option value="">Mark All As</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleClearAll}
                                className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 sm:w-auto"
                            >
                                Clear All
                            </button>
                        </div>
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
                                {filteredStudents.map((student, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 pr-4">{student?.student?.name}</td>
                                        <td className="py-3 pr-4">{student?.student?.room}</td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={attUpdatedData[student?.student?._id] || student.status} // Show updated value or initial value
                                                onChange={(e) => handleAttendanceChange(student?.student?._id, e.target.value)}
                                                className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${getStatusColor(attUpdatedData[student?.student?._id] || student?.status)} `}
                                            >
                                                <option value="">Select Status</option>
                                                {statusOptions.map(option => (
                                                    <option className={`${getStatusColor(option?.value)}`} key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6">
                    <button onClick={handleSaveAttendance} className="flex  w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto">
                        <Save className="mr-2 h-5 w-5" />
                        Update Attendance
                    </button>
                </div>
            </div>
        </div>
    )
}