"use server";
import { connectToDatabase } from "@/database/dbConn";
import DrinkWater from "@/database/models/drink-water-model";
import Room from "@/database/models/room-model";
import { NextRequest, NextResponse } from "next/server";
// Database Connection
// Ensure the database connection is established before processing requests
connectToDatabase();

// --------------------
// DRINK WATER COMPLAINT POST LOGIC
// -----------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: { user: string; issue: string } }
) {
  // if params.issue === drinkwater then use this
  if (params.issue === "drinkwater") {
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { RelevantData } = reqBody;

      await DrinkWater.create({
        complainfirst: RelevantData,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Drink-Water Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else if (params.issue === "room") {
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { RelevantData } = reqBody;

      await Room.create({
        roomCom: RelevantData,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Drink-Water Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    try {
      return NextResponse.json({
        msg: "Not Found Your Issue.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
