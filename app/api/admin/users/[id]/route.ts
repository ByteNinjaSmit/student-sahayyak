"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Delete a User by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string} }) {
    try {
        // Parse the request URL to extract the user ID from the params
        // const { searchParams } = new URL(request.url);
        const userId = params.id as String;

        // Check if the ID is valid
        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete({_id:userId}).exec();

        // If no user was found with that ID, return an error
        if (!deletedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Return a success response with the deleted user info
        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);

        // Return an error response
        return NextResponse.json(
            { message: "Failed to delete user" },
            { status: 500 }
        );
    }
}
// Update a User by ID (PATCH method)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id as String;
        const { username, room, hostelId, password } = await request.json();

        // Check if the ID is valid
        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Object to hold the fields to update
        const updateData: any = {};

        // Add fields to updateData only if provided in the request body
        if (username) updateData.username = username;
        if (room) updateData.room = room;
        if (hostelId) updateData.hostelId = hostelId;

        // If the password is provided, hash it before updating
        if (password) {
            const saltRound = await bcrypt.genSalt(10);
            const hash_password = await bcrypt.hash(password, saltRound);
            updateData.password = hash_password;
        }

        // Find the user by ID and update with the provided fields
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();

        // If no user was found with that ID, return an error
        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Return a success response with the updated user info
        return NextResponse.json(
            { message: "User updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);

        // Return an error response
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
}