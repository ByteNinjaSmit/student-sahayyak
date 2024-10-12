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
      foundDocument = await model.findById(issueid).populate("user", "-password").exec();
      if (foundDocument) {
        foundCategory = category; // Save the found category
        break; // Exit loop once a document is found
      }
    }

    // If no document is found, return a 404 response
    if (!foundDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Return the found document along with the category
    return NextResponse.json({ document: foundDocument, category: foundCategory });
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
//  PATCH Method To Change Status 
// Function to handle PATCH requests (update status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { issueid: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Destructure the issueid from params
    const { issueid } = params;

    // Extract the status from the request body
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Array of models
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

    let updatedDocument = null;

    // Try to find the document and update the status
    for (const model of models) {
      updatedDocument = await model.findByIdAndUpdate(
        issueid,
        { status: status }, // Update the status
        { new: true } // Return the updated document
      ).exec();

      if (updatedDocument) {
        break; // Exit loop once the document is found and updated
      }
    }

    // If no document was updated, return a 404 response
    if (!updatedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Return the updated document
    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Error updating status" }, { status: 500 });
  }
}