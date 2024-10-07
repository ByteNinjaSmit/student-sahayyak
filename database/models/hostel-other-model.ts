import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const hostelotherSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
        // Description Long
    },
    status:{
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

const HostelOther = models.HostelOther || model('HostelOther',hostelotherSchema);
export default HostelOther;
