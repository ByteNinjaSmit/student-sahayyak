"use server";

import { connectToDatabase } from "@/database/dbConn"; // Ensure this path is correct
import Attendance from "@/database/models/attendance-model"; // Ensure this path is correct
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the incoming request body
    const body = await request.json();

    // Check if an attendance entry for the same date and hostel already exists
    const existingAttendance = await Attendance.findOne({
      date: body.date,
      hostel: body.hostel,
    });

    if (existingAttendance) {
      return NextResponse.json(
        { message: "Attendance for this date and hostel already exists." },
        { status: 409 }
      );
    }

    // Create a new attendance entry
    const newAttendance = new Attendance({
      date: body.date,
      hostel: body.hostel,
      students: body.students, // Ensure this is an array of student objects
    });

    // Save the new attendance entry to the database
    await newAttendance.save();

    // Return a success message in the response
    return NextResponse.json(
      { message: "Attendance saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json(
      { message: "Error saving attendance", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Retrieve all attendance records from the database and populate students' information without the password field
    const attendanceRecords = await Attendance.find({})
      .populate({
        path: 'students.student',
        select: '-password', // Exclude the password field
      });

    // Return the attendance records in the response
    return NextResponse.json(attendanceRecords, { status: 200 });
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    return NextResponse.json(
      { message: "Error retrieving attendance records", error },
      { status: 500 }
    );
  }
}