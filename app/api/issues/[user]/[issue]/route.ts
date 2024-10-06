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
connectToDatabase();

export async function POST(
  request: NextRequest,
  { params }: { params: { user: string; issue: string } }
) {
  // if params.issue === drinkwater then use this

  // --------------------
  // DRINK WATER COMPLAINT POST LOGIC
  // -----------------------------

  if (params.issue === "drinkingwater") {
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await DrinkWater.create({
        complainfirst: relevantData,
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
    // --------------------
    // ROOM COMPLAINT POST LOGIC
    // -----------------------------

    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await Room.create({
        roomCom: relevantData,
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
  }
  // --------------------
  // CORRIDOR COMPLAINT POST LOGIC
  // -----------------------------
  else if (params.issue === "corridor") {
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await Corridor.create({
        complaint: relevantData,
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
  } else if (params.issue === "commonarea") {
    // --------------------
    // COOMON AREA COMPLAINT POST LOGIC
    // -----------------------------
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await CommonArea.create({
        complainfirst: relevantData,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Common Area Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else if (params.issue === "foodquality") {
    // --------------------
    // FOOD QUALITY COMPLAINT POST LOGIC
    // -----------------------------
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData, foodownerName, foodServiceType } = reqBody;

      await FoodQuality.create({
        complainfirst: relevantData,
        foodOwner: foodownerName,
        service: foodServiceType,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Common Area Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else if (params.issue === "foodowner") {
    // --------------------
    // FOOD OWNER COMPLAINT POST LOGIC
    // -----------------------------
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData, foodownerName, foodServiceType } = reqBody;

      await FoodOwner.create({
        complainfirst: relevantData,
        foodOwner: foodownerName,
        service: foodServiceType,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Food Owner Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else if (params.issue === "wifiissues") {
    // --------------------
    // WIFI-ISSUE COMPLAINT POST LOGIC
    // -----------------------------
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await NetworkConn.create({
        complainfirst: relevantData,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Network Issue Raised Grievance.",
        status: 200,
      });
    } catch (error) {
      console.error("Error To Raise Grievance:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else if (params.issue === "security") {
    // --------------------
    // Safety & Disturbance COMPLAINT POST LOGIC
    // -----------------------------
    try {
      // Parse the request body
      const reqBody = await request.json();
      const { relevantData } = reqBody;

      await Safety.create({
        complainfirst: relevantData,
        user: params.user,
      });

      return NextResponse.json({
        msg: "Network Issue Raised Grievance.",
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
