import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the FoodQuality document


interface ActionLog {
  action: string; // Describes the action taken (e.g., "Processed", "Resolved")
  actionTakenBy: string; // Name or identifier of the person who took the action
  actionDate: Date; // Timestamp for when the action occurred
  remarks?: string; // Optional remarks or additional information
}
interface FoodQualityDocument extends Document {
  _id:string;
  foodOwner: string;
  service: string;
  complaint: string[];
  status: string;
  actionLog: ActionLog[];
  user?: string;
  createdAt:string;
  updatedAt:string;
}

// Define the ActionLog schema
const actionLogSchema = new Schema<ActionLog>(
  {
    action: {
      type: String,
      default: "Not Processed",
      required: true,
    },
    actionTakenBy: {
      type: String,
      default: "User",
      required: true,
    },
    actionDate: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: "No remarks provided",
    },
  },
  { _id: false } // Prevents creating an _id field for nested documents
);


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
    actionLog: {
      type: [actionLogSchema], // Use the defined schema for ActionLog
      default: [
        {
          action: "Not Processed",
          actionTakenBy: "User",
          actionDate: new Date(),
          remarks: "No remarks provided",
        },
      ],
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
