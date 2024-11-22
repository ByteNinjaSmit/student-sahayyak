import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the Attendance document
interface AttendanceDocument extends Document {
  _id:string;
  date: Date;
  hostel: string;
  students: Array<{
    student: mongoose.Types.ObjectId;
    status: "Present" | "Absent" | "Leave" | "Late";
    remarks?: string;
  }>;
  createdAt:string;
  updatedAt:string;
}

// Define the Attendance schema
const AttendanceSchema = new Schema<AttendanceDocument>(
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
          ref: "User", // Reference to the User model for student
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Late"],
          required: true,
        },
        remarks: {
          type: String, // Optional field for additional remarks
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Singleton pattern to ensure the model is compiled only once
const Attendance = (() => {
  try {
    return model<AttendanceDocument>("Attendance"); // Return the existing model if it exists
  } catch {
    return model<AttendanceDocument>("Attendance", AttendanceSchema); // Otherwise, create and return a new model
  }
})();

export default Attendance;
