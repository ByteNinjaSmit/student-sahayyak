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

export async function GET(
  request: NextRequest,
  { params }: { params: { user: string } }
) {
  try {
    await connectToDatabase();
    
    // Extract the user parameter
    const { user } = params;
    
    // Fetch data from all models where `user` matches the provided user
    const drinkWaterData = await DrinkWater.find({ user: user });
    const roomData = await Room.find({ user: user });
    const commonAreaData = await CommonArea.find({ user: user });
    const corridorData = await Corridor.find({ user: user },"-image");
    const foodQualityData = await FoodQuality.find({ user: user });
    const foodOwnerData = await FoodOwner.find({ user: user });
    const networkData = await NetworkConn.find({ user: user });
    const safetyData = await Safety.find({ user: user });

    // Combine all the arrays into one with categories
    const combinedData = [
      ...drinkWaterData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
      ...roomData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
      ...commonAreaData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
      ...corridorData.map(doc => ({ ...doc.toObject(), category: 'Hostel' })),
      ...foodQualityData.map(doc => ({ ...doc.toObject(), category: 'Mess / Tiffin' })),
      ...foodOwnerData.map(doc => ({ ...doc.toObject(), category: 'Mess / Tiffin' })),
      ...networkData.map(doc => ({ ...doc.toObject(), category: 'Facility' })),
      ...safetyData.map(doc => ({ ...doc.toObject(), category: 'Security' })),
    ];

    // Sort the combined data by `createdAt` in descending order
    combinedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Return the sorted combined data
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}