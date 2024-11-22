import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the Corridor document
interface CorridorDocument extends Document {
  _id:string;
  complaint: string[];
  status: string;
  image: string;
  user?: string;
  actionLog: Array<{
    action: string;
    actionTakenBy: string;
    actionDate: Date;
    remarks?: string;
  }>;
  createdAt:string;
  updatedAt:string;
}

// Define the Corridor schema
const corridorSchema = new Schema<CorridorDocument>(
  {
    complaint: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the user who submitted the complaint
    },
    actionLog: [
      {
        action: {
          type: String,
          required: true, // Example: "Processed", "Resolved", "In Progress"
        },
        actionTakenBy: {
          type: mongoose.Types.ObjectId,
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
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Singleton pattern to ensure the model is compiled only once
const Corridor = (() => {
  try {
    return model<CorridorDocument>("Corridor"); // Return the existing model if it exists
  } catch {
    return model<CorridorDocument>("Corridor", corridorSchema); // Otherwise, create and return a new model
  }
})();

export default Corridor;
