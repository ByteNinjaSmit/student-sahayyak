"use server";
import { connectToDatabase } from "@/database/dbConn";
import Faculty from "@/database/models/high-authority-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
      await connectToDatabase();
      // Parse request body
      const reqBody = await request.json();
      const { username, email, hostelId,phone, password } = reqBody;
  
      // Validate that all fields are provided
      if (!username || !email || !phone || !password) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
  
      const userExist = await Faculty.findOne({ username });
      if (userExist) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 }
        );
      }
  
      // Hash the password before saving
      //const hashedPassword = await bcrypt.hash(password, 10);
  
      const userCreated = await Faculty.create({
        username,
        email,
        hostelId,
        phone,
        password
      });
  
  
      return NextResponse.json({
        msg: "Registration successful",
      });
    } catch (error) {
      console.error("Error occurred during registration:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }