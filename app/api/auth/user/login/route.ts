"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

// Ensure the database connection is established before processing requests
connectToDatabase();

export async function POST(request: NextRequest) {
  try {
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

    const userExist = await User.findOne({username});
    if (!userExist) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 }
      );
    }
    const user = await userExist.comparePassword(password);

    if(user){
      return NextResponse.json({
        msg: "Login Successfull",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        userExist,
        status: 200,
    });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}