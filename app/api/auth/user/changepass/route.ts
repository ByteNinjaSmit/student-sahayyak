"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectToDatabase();

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, username, newpassword } = reqBody;

    // Validate that both username and password are provided
    if (!username || !newpassword) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    // Hash the new password
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(newpassword, saltRound);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: hash_password },
    );
    await user.save(); // Save the updated user document this function is available in my user-model 
    // in that save function having hashing

    if (!user) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { msg: "Password Changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred during Changing password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
