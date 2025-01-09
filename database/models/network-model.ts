import mongoose, { Schema, model, Document, Types } from "mongoose";

// Define the interface for the ActionLog

interface ActionLog {
  action: string; // Describes the action taken (e.g., "Processed", "Resolved")
  actionTakenBy: string; // Name or identifier of the person who took the action
  actionDate: Date; // Timestamp for when the action occurred
  remarks?: string; // Optional remarks or additional information
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

// Singleton pattern for model definition to ensure it's compiled only once
const NetworkConn = (() => {
  try {
    return model<NetworkConnDocument>("NetworkConn"); // Return the existing model if it's already compiled
  } catch {
    return model<NetworkConnDocument>("NetworkConn", networkconnSchema); // Otherwise, define and return the new model
  }
})();

export default NetworkConn;
