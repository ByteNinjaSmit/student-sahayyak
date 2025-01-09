import mongoose, { Schema, model, Document } from "mongoose";

// Interface for ActionLog
interface ActionLog {
  action: string; // Describes the action taken (e.g., "Processed", "Resolved")
  actionTakenBy: string; // Name or identifier of the person who took the action
  actionDate: Date; // Timestamp for when the action occurred
  remarks?: string; // Optional remarks or additional information
}

// Interface for SafetyDocument
interface SafetyDocument extends Document {
  _id:string;
  complaint: string[];
  status: string;
  user?:string ;
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

// Define the Safety schema
const safetySchema = new Schema<SafetyDocument>(
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
      type: mongoose.Schema.Types.ObjectId, // Corrected here
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
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Singleton pattern to ensure the model is compiled only once
const Safety = (() => {
  try {
    // Return the existing model if it is already compiled
    return model<SafetyDocument>("Safety");
  } catch {
    // Otherwise, define and return the new model
    return model<SafetyDocument>("Safety", safetySchema);
  }
})();

export default Safety;
