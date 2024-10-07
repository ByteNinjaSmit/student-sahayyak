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
  { params }: { params: { user: string; issueid: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Destructure the issueid from params
    const { issueid } = params;

    // Try to fetch data from each model and return the first found document
    const models = [
      DrinkWater,
      Room,
      CommonArea,
      Corridor,
      FoodQuality,
      FoodOwner,
      NetworkConn,
      Safety,
    ];

    let foundDocument = null;

    for (const model of models) {
      foundDocument = await model.findById({_id: issueid}).exec();
      if (foundDocument) {
        break; // Exit loop once a document is found
      }
    }

    // If no document is found, return a 404 response
    if (!foundDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Return the found document
    return NextResponse.json(foundDocument);
  } catch (error) {
    console.error("Error fetching issue data:", error);
    return NextResponse.json({ error: "Error fetching issue data" }, { status: 500 });
  }
}

// Function to handle DELETE requests
export async function DELETE(
  request: NextRequest,
  { params }: { params: { issueid: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Destructure the issueid from params
    const { issueid } = params;

    // Try to delete the document from each model and return response
    const models = [
      DrinkWater,
      Room,
      CommonArea,
      Corridor,
      FoodQuality,
      FoodOwner,
      NetworkConn,
      Safety,
    ];

    for (const model of models) {
      const deletedDocument = await model.findByIdAndDelete({_id: issueid}).exec();
      if (deletedDocument) {
        return NextResponse.json({ message: "Document deleted successfully" });
      }
    }

    // If no document is found to delete, return a 404 response
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting issue data:", error);
    return NextResponse.json({ error: "Error deleting issue data" }, { status: 500 });
  }
}
