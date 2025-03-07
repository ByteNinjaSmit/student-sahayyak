// @/app/api/issue/getissue/all-issue
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
import User from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const drinkWaterData = await DrinkWater.find().populate({
      path: "user",
      model: "User", // Ensure you explicitly use the User model
      select: "-password",
      options: { strictPopulate: false },
    });

    const roomData = await Room.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const commonAreaData = await CommonArea.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const corridorData = await Corridor.find({}, "-image").populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const foodQualityData = await FoodQuality.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const foodOwnerData = await FoodOwner.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const networkData = await NetworkConn.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    const safetyData = await Safety.find().populate({
      path: "user",
      model: "User",
      select: "-password",
      options: { strictPopulate: false },
    });

    // Fetch all data in parallel
    // const results = await Promise.all(fetchPromises);

    // Flatten the results array and sort it by createdAt
    // Combine all the arrays into one with categories
    const combinedData = [
      ...drinkWaterData.map((doc) => ({
        ...doc.toObject(),
        category: "Hostel",
      })),
      ...roomData.map((doc) => ({ ...doc.toObject(), category: "Hostel" })),
      ...commonAreaData.map((doc) => ({
        ...doc.toObject(),
        category: "Hostel",
      })),
      ...corridorData.map((doc) => ({ ...doc.toObject(), category: "Hostel" })),
      ...foodQualityData.map((doc) => ({
        ...doc.toObject(),
        category: "Mess / Tiffin",
      })),
      ...foodOwnerData.map((doc) => ({
        ...doc.toObject(),
        category: "Mess / Tiffin",
      })),
      ...networkData.map((doc) => ({
        ...doc.toObject(),
        category: "Facility",
      })),
      ...safetyData.map((doc) => ({
        ...doc.toObject(),
        category: "Security",
      })),
    ];
    combinedData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Prepare the response
    const response = NextResponse.json(combinedData);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Expires", "0");
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data Server Error" },
      { status: 500 }
    );
  }
}
