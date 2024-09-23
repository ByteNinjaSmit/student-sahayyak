import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const facultycomplaintSchema = new Schema({
    complaintfirst:{
        type:[String],
        required:true,
        // It is Array
    },
    complaintStatus:{
        type:String,
        default:"Not Processed",
    },
    user: {
        type: mongoose.Types.ObjectId, // Use Types.ObjectId for better practice
        ref: "Users", // Reference the User model
    },
},
{ timestamps: true }
);

const FacultyComplaint = models.FacultyComplaint || model('FacultyComplaint',facultycomplaintSchema);
export default FacultyComplaint;
