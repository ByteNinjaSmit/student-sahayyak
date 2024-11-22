import mongoose, { Schema, model, Document } from "mongoose";

// Interface for ActionLog
interface ActionLog {
  action: string;
  actionTakenBy: string;
  actionDate: Date;
  remarks?: string;
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
    actionLog: [
      {
        action: {
          type: String,
          required: true, // Example: "Processed", "Resolved", "In Progress"
        },
        actionTakenBy: {
          type: mongoose.Schema.Types.ObjectId, // Corrected here
          ref: "User", // Reference to the admin who took the action
          required: true,
        },
        actionDate: {
          type: Date,
          default: Date.now,
        },
        remarks: {
          type: String, // Optional field for additional information
        },
      },
    ],
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
