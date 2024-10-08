"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies utility

// Ensure the database connection is established before processing requests


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    // Parse request body
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Validate that both username and password are provided
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const userExist = await User.findOne({ username });
    if (!userExist) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 }
      );
    }
    const user = await userExist.comparePassword(password);
    if (user) {
      const token = await userExist.generateToken();
      // Set the httpOnly cookie for security
      cookies().set("user-token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2,
      });

      // Also, set a non-httpOnly cookie for tracking login state
      cookies().set("isLoggedIn", "true", {
        path: "/",
        maxAge: 60 * 60 * 2,
      });

      // Return the success response
      return NextResponse.json({
        msg: "Login Successful",
        token: token,
        userId: userExist._id.toString(),
        userExist,
        status: 200,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
