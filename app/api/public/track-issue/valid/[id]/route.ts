"use server";
import { connectToDatabase } from "@/database/dbConn";
import DrinkWater from "@/database/models/drink-water-model";
import Room from "@/database/models/room-model";
import CommonArea from "@/database/models/commonArea-model";
import Corridor from "@/database/models/corridor-model";
import FoodQuality from "@/database/models/food-quality-model";
import FoodOwner from "@/database/models/food-owner-model";
import NetworkConn from "@/database/models/network-model";
import Safety from "@/database/models/safety-model";
import { NextRequest, NextResponse } from "next/server";

// Function to handle GET requests
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Destructure the issueid from params
    const { id } = params;
    const issueid = id;

    // Array of models
    const models = [
      { model: DrinkWater },
      { model: Room },
      { model: CommonArea },
      { model: Corridor },
      { model: FoodQuality },
      { model: FoodOwner },
      { model: NetworkConn },
      { model: Safety },
    ];

    let foundDocument = null;

    // Try to fetch data from each model and return the first found document
    for (const { model } of models) {
      foundDocument = await model.findById(issueid).exec();
      if (foundDocument) {
        break; // Exit loop once a document is found
      }
    }

    // If no document is found, return a response indicating the ID is invalid
    if (!foundDocument) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    // If a document is found, return a response indicating the ID is valid
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking issue ID:", error);
    return NextResponse.json(
      { error: "Error checking issue ID" },
      { status: 500 }
    );
  }
}
