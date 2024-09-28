"use server";
import { connectToDatabase } from "@/database/dbConn";
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

// To Connect the Database
connectToDatabase();
// --------------
// Register Logic
// ---------------
// Function to handle user login

export async function registerUser(req: NextRequest) {
  try {
    // Parse request body
    const reqBody = await req.json();
    const { username, roomNumber, hostelName, password } = reqBody;

    // Validate that all fields are provided
    if (!username || !roomNumber || !hostelName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const userExist = await User.findOne({ username });
    if (userExist) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await User.create({
      username,
      room: roomNumber,
      hostelId: hostelName,
      password,
    });

    const token = await userCreated.generateToken();

    return NextResponse.json({
      msg: "Registration successful",
      token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//-----------------
// Login Logic
// ----------------

export async function loginUser(req: NextRequest) {
    try {
        // Parse request body
        const reqBody = await req.json();
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
