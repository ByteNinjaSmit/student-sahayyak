import mongoose from "mongoose"; 
import { Schema, model, models } from "mongoose"; 

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
            ref: "Users", // Reference the User model
        },
    },
    { timestamps: true } // Move this here as an option to the Schema
);

const Room = models.Room || model('Room', roomSchema);
export default Room;
