"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;
    // Validate that the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user by ID and exclude the password field
    const userDetails = await User.find({_id:id}).select("-password");

    // Check if the user exists
    if (!userDetails) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: "User details fetched successfully",
      data: userDetails,
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
