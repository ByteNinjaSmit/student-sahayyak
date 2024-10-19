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

// Database Connection
// Ensure the database connection is established before processing requests

export async function POST(
  request: NextRequest,
  { params }: { params: { user: string; issue: string } }
) {
  await connectToDatabase();  

  // Helper function to validate relevantData
  const isValidComplaint = (relevantData: string[] | undefined) => {
    return Array.isArray(relevantData) && relevantData.length > 0 && relevantData.every(item => item.length >= 2);
  };
  const isValidOwner = (foodownerName: string | undefined) => {
    return foodownerName && foodownerName.length >= 2;
  }
  const isValidFoodServiceType= (foodServiceType: string | undefined) => {
    return foodServiceType && foodServiceType.length >= 2;
  }

  // Parse the request body
  const reqBody = await request.json();
  const { relevantData, foodownerName, foodServiceType } = reqBody;

  // Validate relevantData
  if (!isValidComplaint(relevantData)) {
    return NextResponse.json({
      error: "Please enter a valid complaint.",
      status: 400,
    });
  }
  if (!isValidOwner(foodownerName)) {
    return NextResponse.json({
      error: "Please enter a valid Owner Name.",
      status: 400,
    });
  }
  if (!isValidFoodServiceType(foodServiceType)) {
    return NextResponse.json({
      error: "Please Select Valid Service.",
      status: 400,
    });
  }
  

  // Process the complaints based on the issue type
  try {
    let msg = ""; // Variable to hold the success message
    switch (params.issue) {
      case "drinkingwater":
        await DrinkWater.create({ complaint: relevantData, user: params.user });
        msg = "Drink-Water Raised Grievance.";
        break;

      case "room":
        await Room.create({ complaint: relevantData, user: params.user });
        msg = "Room Raised Grievance.";
        break;

      case "corridor":
        await Corridor.create({ complaint: relevantData, user: params.user });
        msg = "Corridor Raised Grievance.";
        break;

      case "commonarea":
        await CommonArea.create({ complaint: relevantData, user: params.user });
        msg = "Common Area Raised Grievance.";
        break;

      case "foodquality":
        await FoodQuality.create({
          complaint: relevantData,
          foodOwner: foodownerName,
          service: foodServiceType,
          user: params.user,
        });
        msg = "Food Quality Raised Grievance.";
        break;

      case "foodowner":
        await FoodOwner.create({
          complaint: relevantData,
          foodOwner: foodownerName,
          service: foodServiceType,
          user: params.user,
        });
        msg = "Food Owner Raised Grievance.";
        break;

      case "wifiissues":
        await NetworkConn.create({ complaint: relevantData, user: params.user });
        msg = "Network Issue Raised Grievance.";
        break;

      case "security":
        await Safety.create({ complaint: relevantData, user: params.user });
        msg = "Security Issue Raised Grievance.";
        break;

      default:
        return NextResponse.json({ error: "Not Found Your Issue.", status: 404 });
    }

    // If the grievance is successfully created, send a success response
    return NextResponse.json({ msg, status: 200 });

  } catch (error) {
    console.error("Error To Raise Grievance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
