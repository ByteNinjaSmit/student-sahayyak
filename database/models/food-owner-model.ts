import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the FoodOwner document
interface ActionLog {
  action: string; // Describes the action taken (e.g., "Processed", "Resolved")
  actionTakenBy: string; // Name or identifier of the person who took the action
  actionDate: Date; // Timestamp for when the action occurred
  remarks?: string; // Optional remarks or additional information
}
interface FoodOwnerDocument extends Document {
  _id:string;
  foodOwner: string;
  service: string;
  complaint: string[];
  actionLog: ActionLog[];
  status: string;
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
const FoodOwner = (() => {
  try {
    return model<FoodOwnerDocument>("FoodOwner"); // Return the existing model if it exists
  } catch {
    return model<FoodOwnerDocument>("FoodOwner", foodownerSchema); // Otherwise, create and return a new model
  }
})();

export default FoodOwner;
