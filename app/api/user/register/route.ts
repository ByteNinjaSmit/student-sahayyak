"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// -------------------
// To Register Logic
// -------------------
connectToDatabase();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { username, roomNumber, hostelName, password } = reqBody;
    if (!username || !roomNumber || !hostelName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username: username,
      room: roomNumber,
      hostelId: hostelName,
      password: hashedPassword,
      userId: username // Assuming you want the username as the userId
  });
  

    const savedUser = await User.create(newUser);

    const token = await savedUser.generateToken();

    return NextResponse.json({
      msg: "User created successfully",
      token: token,
      userId: savedUser._id.toString(),
    });
  } catch (error) {
    console.error("Error occurred during registration:", error.stack || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
