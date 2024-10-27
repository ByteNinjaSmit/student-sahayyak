import mongoose, { Schema, model } from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    hostel: {
      type: String,
      required: true,
    },
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Late"],
          required: true,
        },
        remarks: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Attendance = (() => {
  try {
    // Return the existing model if it is already compiled
    return model("Attendance");
  } catch {
    // Otherwise, define and return the new model
    return model("Attendance", AttendanceSchema);
  }
})();
// const CommonArea = model('CommonArea',commonareaSchema);
export default Attendance;
