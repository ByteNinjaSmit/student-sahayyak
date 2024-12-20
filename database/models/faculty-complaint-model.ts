import mongoose, { Schema, model } from "mongoose";

const facultycomplaintSchema = new Schema(
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
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const FacultyComplaint = (() => {
  try {
    // Return the existing model if it is already compiled
    return model("FacultyComplaint");
  } catch {
    // Otherwise, define and return the new model
    return model("FacultyComplaint", facultycomplaintSchema);
  }
})();

// const FacultyComplaint = model('FacultyComplaint',facultycomplaintSchema);
export default FacultyComplaint;
