import mongoose from "mongoose";
import DrinkWater from "@/database/models/drink-water-model";
import Room from "@/database/models/room-model";
import CommonArea from "@/database/models/commonArea-model";
import Corridor from "@/database/models/corridor-model";
import FoodQuality from "@/database/models/food-quality-model";
import FoodOwner from "@/database/models/food-owner-model";
import NetworkConn from "@/database/models/network-model";
import Safety from "@/database/models/safety-model";
import User from "@/database/models/user-model";  // Ensure User model is imported

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGO_URI, {
        dbName: "Hostellers",  // Your database name
        bufferCommands: false,  // Prevent MongoDB from buffering commands if connection is unavailable
        socketTimeoutMS: 30000,  // Set a timeout for socket operations
        serverSelectionTimeoutMS: 5000,  // Timeout for finding a suitable server
        connectTimeoutMS: 10000,  // Connection timeout
        // useCreateIndex: true,  // Create indexes efficiently (if using older mongoose versions)
        // useFindAndModify: false,  // Use native MongoDB methods (if using older mongoose versions)
      });
    }

    cached.conn = await cached.promise;
    
    // Models are imported for initialization (side effect)
    DrinkWater;
    Room;
    CommonArea;
    Corridor;
    FoodQuality;
    FoodOwner;
    NetworkConn;
    Safety;
    User;

    // Log successful connection
    console.log("Successfully connected to MongoDB:", MONGO_URI);

  } catch (error:any) {
    console.error("Failed to connect to MongoDB:", error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error("MongoDB connection was refused. Please check the MongoDB server.");
    } else if (error.name === 'MongoNetworkError') {
      console.error("Network error while connecting to MongoDB. Please check your network or MongoDB server.");
    }
    throw new Error("Failed to connect to the database");
  }

  return cached.conn;
};
