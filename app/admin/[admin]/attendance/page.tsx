'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';



const HostelStudentAttendance = () => {
    
    const students = [
        { id: 1, name: 'John Doe', roomNumber: '101', floor: '1st Floor' },
        { id: 2, name: 'Jane Smith', roomNumber: '102', floor: '1st Floor' },
        { id: 3, name: 'Alice Johnson', roomNumber: '103', floor: '1st Floor' },
        { id: 4, name: 'Bob Williams', roomNumber: '104', floor: '1st Floor' },
        { id: 5, name: 'Charlie Brown', roomNumber: '105', floor: '1st Floor' },
    ];

    const floors = ['1st Floor', '2nd Floor', '3rd Floor'];
    const rooms = ['101', '102', '103', '104', '105'];

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [attendanceData, setAttendanceData] = useState(
        students.map(student => ({ ...student, status: 'Present' }))
    );

    const filteredStudents = attendanceData.filter(student =>
        (selectedFloor === '' || student.floor === selectedFloor) &&
        (selectedRoom === '' || student.roomNumber === selectedRoom) &&
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || student.status === statusFilter)
    );


    const updateStatus = (id : any, status : any) => {
        setAttendanceData(prev =>
            prev.map(student => student.id === id ? { ...student, status } : student)
        );
    };

    const markAll = (status : any) => {
        setAttendanceData(prev => prev.map(student => ({ ...student, status })));
    };

    const getStatusColor = (status : any) => {
        switch (status) {
            case 'Present': return 'text-green-600';
            case 'Absent': return 'text-red-600';
            case 'Leave': return 'text-yellow-600';
            case 'Late': return 'text-orange-600';
            default: return '';
        }
    };

    const handleSubmit = () => {
        console.log('Attendance data:', attendanceData);
    };

    const summary = attendanceData.reduce((acc : any, student : any) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Hostel Student Attendance</h1>
                <div className="flex items-center space-x-4">
                    <Calendar className="text-gray-500" />
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        max={format(new Date(), 'yyyy-MM-dd')}
                        className="w-40 p-2 border rounded"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(summary).map(([status, count]) => (
                    <div key={status} className="p-4 border rounded-lg shadow">
                        <h2 className="text-lg font-semibold">{status}</h2>
                        <div className={`text-2xl font-bold ${getStatusColor(status)}`}>{count as number}</div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="w-full md:w-[180px] p-2 border rounded"
                >
                    <option value="">Select Floor</option>
                    {floors.map(floor => (
                        <option key={floor} value={floor}>{floor}</option>
                    ))}
                </select>
                <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full md:w-[180px] p-2 border rounded"
                >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex space-x-4">
                    <input
                        placeholder="Search by name or room"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 p-2 border rounded"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-[180px] p-2 border rounded"
                    >
                        <option value="">Filter by status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                        <option value="Late">Late</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => markAll('Present')} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Mark All Present
                    </button>
                    <button onClick={() => markAll('Absent')} className="px-4 py-2 bg-red-500 text-white rounded">
                        Mark All Absent
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Room Number</th>
                        <th className="px-4 py-2 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id} className="text-center border-b">
                            <td className="px-4 py-2 border">{student.name}</td>
                            <td className="px-4 py-2 border">{student.roomNumber}</td>
                            <td className="px-4 py-2 border">
                                <select
                                    value={student.status}
                                    onChange={(e) => updateStatus(student.id, e.target.value)}
                                    className={`p-2 rounded ${getStatusColor(student.status)}`}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                    <option value="Late">Late</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleSubmit}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
            >
                Submit Attendance
            </button>
        </div>
    );
};

export default HostelStudentAttendance;
