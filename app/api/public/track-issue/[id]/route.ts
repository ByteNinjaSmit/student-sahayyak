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
    const issueid =id;

    // Array of models and their respective category names
    const models = [
      { model: DrinkWater, category: "Hostel" },
      { model: Room, category: "Hostel" },
      { model: CommonArea, category: "Hostel" },
      { model: Corridor, category: "Hostel" },
      { model: FoodQuality, category: "Mess / Tiffin" },
      { model: FoodOwner, category: "Mess / Tiffin" },
      { model: NetworkConn, category: "Facility" },
      { model: Safety, category: "Security" },
    ];

    let foundDocument = null;
    let foundCategory = null;

    // Try to fetch data from each model and return the first found document
    for (const { model, category } of models) {
      foundDocument = await model
        .findById(issueid)
        .populate("user", "-password")
        .exec();
      if (foundDocument) {
        foundCategory = category; // Save the found category
        break; // Exit loop once a document is found
      }
    }

    // If no document is found, return a 404 response
    if (!foundDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Return the found document along with the category
    return NextResponse.json({
      document: foundDocument,
      category: foundCategory,
    });
  } catch (error) {
    console.error("Error fetching issue data:", error);
    return NextResponse.json(
      { error: "Error fetching issue data" },
      { status: 500 }
    );
  }
}
