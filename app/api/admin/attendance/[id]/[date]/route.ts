"use server";

import { connectToDatabase } from "@/database/dbConn"; // Ensure this path is correct
import Attendance from "@/database/models/attendance-model"; // Ensure this path is correct
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; date: string } }
) {
  try {
    const { date, id } = params;
    if (!id || !date) {
      return new Response("Invalid request", { status: 400 });
    }
    // Parse the date to match the stored format
    const attendanceDate = new Date(date);
    // Find the attendance document for the given hostel and date
    const attendance = await Attendance.findOne({
      date: attendanceDate,
      hostel: id,
    });

    if (!attendance) {
      return NextResponse.json(
        {
          message: "No attendance found for the given hostel and date",
        },
        {
          status: 404,
        }
      );
    }
    // Return the attendance document as JSON
    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving attendance record", error },
      { status: 500 }
    );
  }
}
