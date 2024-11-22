import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the FoodOwner document
interface FoodOwnerDocument extends Document {
  _id:string;
  foodOwner: string;
  service: string;
  complaint: string[];
  status: string;
  user?: string;
  createdAt:string;
  updatedAt:string;
}

// Define the FoodOwner schema
const foodownerSchema = new Schema<FoodOwnerDocument>(
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
      required: true, // It is an array of complaints
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
const FoodOwner = (() => {
  try {
    return model<FoodOwnerDocument>("FoodOwner"); // Return the existing model if it exists
  } catch {
    return model<FoodOwnerDocument>("FoodOwner", foodownerSchema); // Otherwise, create and return a new model
  }
})();

export default FoodOwner;
