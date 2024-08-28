"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

// Connecting to Database
connectToDatabase();

// *--------------------------
// User Login Logic
// *--------------------------

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;
    const userId = username;
    // Check if user exists
    const userExist = await User.findOne({ userId });
    if (!userExist) {
      return NextResponse.json({ message: "Invalid Credentials" }, { status: 400 });
    }

    // Compare password using your custom method
    const isPasswordMatch = await userExist.comparePassword(password);

    if (isPasswordMatch) {
      // Generate JWT token
      const token = await userExist.generateToken();

      return NextResponse.json({
        msg: "Login Successful",
        token,
        userId: userExist._id.toString(),
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid Username Or Password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
