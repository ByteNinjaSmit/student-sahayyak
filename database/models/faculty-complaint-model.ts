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
