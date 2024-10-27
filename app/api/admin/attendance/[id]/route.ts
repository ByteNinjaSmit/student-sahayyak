"use server";

import { connectToDatabase } from "@/database/dbConn"; // Ensure this path is correct
import Attendance from "@/database/models/attendance-model"; // Ensure this path is correct
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the attendance ID from the URL parameters
    const { id } = params;

    // Retrieve the attendance record by ID and populate student information without the password field
    const attendanceRecord = await Attendance.findById(id).populate({
      path: 'students.student',
      select: '-password', // Exclude the password field
    });

    // Check if the attendance record exists
    if (!attendanceRecord) {
      return NextResponse.json(
        { message: "Attendance record not found." },
        { status: 404 }
      );
    }

    // Return the attendance record in the response
    return NextResponse.json(attendanceRecord, { status: 200 });
  } catch (error) {
    console.error("Error retrieving attendance record:", error);
    return NextResponse.json(
      { message: "Error retrieving attendance record", error },
      { status: 500 }
    );
  }
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the attendance ID from the URL parameters
    const { id } = params;

    // Parse the request body to get the new students array
    const { students } = await request.json();

    // Check if students array is provided
    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { message: "Invalid data: 'students' should be an array." },
        { status: 400 }
      );
    }

    // Find the attendance record by ID and update the students field
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      {_id:id},
      { students }, // Set the new students array
      { new: true, runValidators: true } // Options to return updated document and run validators
    );

    // If attendance record is not found, return a 404 response
    if (!updatedAttendance) {
      return NextResponse.json(
        { message: "Attendance record not found." },
        { status: 404 }
      );
    }

    // Return the updated attendance record
    return NextResponse.json(
      { message: "Attendance updated successfully.", data: updatedAttendance },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { message: "Error updating attendance", error },
      { status: 500 }
    );
  }
}