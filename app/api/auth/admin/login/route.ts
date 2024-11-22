"use server";
import { connectToDatabase } from "@/database/dbConn";
import Faculty from "@/database/models/high-authority-model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
// Ensure the database connection is established before processing requests
type Query = Record<string, any>;
interface FacultyDocument extends Document {
  _id: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => Promise<string>;
  isRector?: boolean;
  isHighAuth?: boolean;
}
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    // Parse request body
    const reqBody = await request.json();
    const { username, password,role } = reqBody;
    // Validate that both username and password are provided
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Define the query object
    let query: Query = { username };

    // Modify the query based on the role
    if (role === "rector") {
      query = { username, isRector: true };  // Add condition to find rector
    } else if (role === "higher-authority") {
      query = { username, isHighAuth: true };  // Add condition to find higher authority
    }

    // Find the user based on the constructed query
    const userExist = await Faculty.findOne(query) as FacultyDocument; // Type assertion

    // const userExist = await Faculty.findOne({ username });
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
      cookies().set("admin-token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2,
      });

      // Also, set a non-httpOnly cookie for tracking login state
      cookies().set("isLoggedIn", "true", {
        path: "/",
        maxAge: 60 * 60 * 2,
      });

      return NextResponse.json({
        msg: "Login Successfull",
        token: token,
        userId: userExist._id.toString(),
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
