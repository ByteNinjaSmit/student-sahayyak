import mongoose, { Schema, model, Document, Types } from "mongoose";

// Define the interface for the ActionLog
interface ActionLog {
  action: string;
  actionTakenBy: string;
  actionDate: Date;
  remarks?: string;
}

// Define the interface for the Room document
interface RoomDocument extends Document {
  _id:string;
  complaint: string[];
  status: string;
  user?:string ;
  actionLog: ActionLog[];
  createdAt:string;
  updatedAt:string;
}

// Define the Room schema
const roomSchema = new Schema<RoomDocument>(
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
const Room = (() => {
  try {
    return model<RoomDocument>("Room"); // Return the existing model if it's already compiled
  } catch {
    return model<RoomDocument>("Room", roomSchema); // Otherwise, define and return the new model
  }
})();

export default Room;
