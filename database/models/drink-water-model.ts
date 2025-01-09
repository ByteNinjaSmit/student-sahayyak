import mongoose, { Schema, model, Document } from "mongoose";


interface ActionLog {
  action: string; // Describes the action taken (e.g., "Processed", "Resolved")
  actionTakenBy: string; // Name or identifier of the person who took the action
  actionDate: Date; // Timestamp for when the action occurred
  remarks?: string; // Optional remarks or additional information
}



// Define the interface for the DrinkWater document
interface DrinkWaterDocument extends Document {
  _id:string;
  complaint: string[];
  status: string;
  user?: string;
  actionLog: ActionLog[];
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


// Define the DrinkWater schema
const drinkwaterSchema = new Schema<DrinkWaterDocument>(
  {
    complaint: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the user who submitted the complaint
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
const DrinkWater = (() => {
  try {
    return model<DrinkWaterDocument>("DrinkWater"); // Return the existing model if it exists
  } catch {
    return model<DrinkWaterDocument>("DrinkWater", drinkwaterSchema); // Otherwise, create and return a new model
  }
})();

export default DrinkWater;
