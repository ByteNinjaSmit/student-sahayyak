"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

// Ensure the database connection is established before processing requests


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    // Parse the request body
    const reqBody = await request.json();
    const { id } = reqBody;

    // Validate that the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user by ID and exclude the password field
    const userDetails = await User.findById(id).select('-password'); 

    // Check if the user exists
    if (!userDetails) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: "User details fetched successfully",
      user: userDetails, 
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
