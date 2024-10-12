"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

// Get All Users
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        // Fetch all users, excluding passwords
        const users = await User.find({}, { password: 0 }).exec();

        // Return a success response with the list of users
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);

        // Return an error response
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
