"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { hostelId: string } }) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Extract the hostelId from the params
        const { hostelId } = params;

        // Query the database for users with the specified hostelId
        const users = await User.find({ hostelId:hostelId }).select('-password'); // Exclude password from results

        // Return the users as a JSON response
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);

        // Return an error response
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
