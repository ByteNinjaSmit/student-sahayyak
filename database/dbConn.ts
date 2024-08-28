import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = await mongoose.connect(MONGO_URI, {
        dbName: "Hostellers",
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    console.log("Connected to MongoDB:", MONGO_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Failed to connect to the database");
  }

  return cached.conn;
};
