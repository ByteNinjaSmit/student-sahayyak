import mongoose, { Schema,model } from "mongoose";

const roomSchema = new Schema(
    {
        complaint: {
            type: [String], // Define as an array of strings
            required: true,
        },
        status: {
            type: String,
            default: "Not Processed",
        },
        user: {
            type: mongoose.Types.ObjectId, // Use Types.ObjectId for better practice
            ref: "User", // Reference the User model
        },
    },
    { timestamps: true } // Move this here as an option to the Schema
);

// Singleton pattern for Safety model definition
const Room = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('Room');
    } catch {
      // Otherwise, define and return the new model
      return model('Room', roomSchema);
    }
  })();

export default Room;
