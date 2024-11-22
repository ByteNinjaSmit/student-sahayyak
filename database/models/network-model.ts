import mongoose, { Schema, model, Document, Types } from "mongoose";

// Define the interface for the ActionLog
interface ActionLog {
  action: string;
  actionTakenBy: string;
  actionDate: Date;
  remarks?: string;
}

// Define the interface for the NetworkConn document
interface NetworkConnDocument extends Document {
  _id:string;
  complaint: string[];
  status: string;
  user?: string;
  actionLog: ActionLog[];
  createdAt:string;
  updatedAt:string;
}

// Define the NetworkConn schema
const networkconnSchema = new Schema<NetworkConnDocument>(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who submitted the complaint
    },
    actionLog: [
      {
        action: {
          type: String,
          required: true, // Example: "Processed", "Resolved", "In Progress"
        },
        actionTakenBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the admin who took the action
          required: true,
        },
        actionDate: {
          type: Date,
          default: Date.now, // Timestamp when the action was taken
        },
        remarks: {
          type: String, // Optional field for additional information about the action
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Singleton pattern for model definition to ensure it's compiled only once
const NetworkConn = (() => {
  try {
    return model<NetworkConnDocument>("NetworkConn"); // Return the existing model if it's already compiled
  } catch {
    return model<NetworkConnDocument>("NetworkConn", networkconnSchema); // Otherwise, define and return the new model
  }
})();

export default NetworkConn;
