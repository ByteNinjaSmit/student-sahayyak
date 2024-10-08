"use server";

import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Ensure the database connection is established before processing requests

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    // Parse request body
    const reqBody = await request.json();
    const { username, roomNumber, hostelName, password } = reqBody;

    // Validate that all fields are provided
    if (!username || !roomNumber || !hostelName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const userExist = await User.findOne({ username });
    if (userExist) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await User.create({
      username,
      room:roomNumber,
      hostelId:hostelName,
      password
    });

    const token = await userCreated.generateToken();

    return NextResponse.json({
      msg: "Registration successful",
      token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}