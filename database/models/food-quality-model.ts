import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the FoodQuality document
interface FoodQualityDocument extends Document {
  _id:string;
  foodOwner: string;
  service: string;
  complaint: string[];
  status: string;
  user?: string;
  createdAt:string;
  updatedAt:string;
}

// Define the FoodQuality schema
const foodqualitySchema = new Schema<FoodQualityDocument>(
  {
    foodOwner: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    complaint: {
      type: [String],
      required: true, // It is Hygene
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Singleton pattern to ensure the model is compiled only once
const FoodQuality = (() => {
  try {
    return model<FoodQualityDocument>("FoodQuality"); // Return the existing model if it exists
  } catch {
    return model<FoodQualityDocument>("FoodQuality", foodqualitySchema); // Otherwise, create and return a new model
  }
})();

export default FoodQuality;
