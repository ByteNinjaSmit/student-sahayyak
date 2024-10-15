"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import Faculty from "@/database/models/high-authority-model";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Define the payload type to ensure userID is a string
interface JwtPayloadWithUserID {
  userID: string;
}

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check for available tokens in the cookies
    const userToken = cookies().get("user-token")?.value;
    const adminToken = cookies().get("admin-token")?.value;

    // Determine the role and model based on the available token
    let userAuthToken: string | undefined;
    let model: any;
    let role: string;

    if (userToken) {
      userAuthToken = userToken;
      model = User; // Use User model for regular users
      role = "user";
    } else if (adminToken) {
      userAuthToken = adminToken;
      model = Faculty; // Use Faculty model for admins or high-authority users
      role = "admin";
    } else {
      // If no token is found, return an error response
      return NextResponse.json(
        { error: "Authentication token not found" },
        { status: 401 }
      );
    }

    // Ensure the secret key is a string
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

    // Verify the JWT token and cast the payload to ensure userID is treated as a string
    const data = jwt.verify(
      userAuthToken,
      jwtSecretKey
    ) as JwtPayloadWithUserID;

    // Find the user/admin by their ID, exclude the password field
    const userOrAdmin = await model
      .findById({ _id: data.userID })
      .select("-password");

    // If the user/admin is not found, return an error response
    if (!userOrAdmin) {
      return NextResponse.json({ error: `${role} not found` }, { status: 404 });
    }

    // Return the user/admin data as a response without the password
    return NextResponse.json(userOrAdmin);
  } catch (error) {
    // Handle JWT verification or any other error
    return NextResponse.json(
      { error: "Invalid token or server error" },
      { status: 500 }
    );
  }
}
