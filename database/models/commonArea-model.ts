import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const commonareaSchema = new Schema({
    complainfirst:{
        type:[String],
        required:true,
        // It is Array
    },
    complaintfirstStatus:{
        type:String,
        default:"Not Processed",
    },
    complainSecond:{
        type:[String],
        required:true,
        // It is Array
    },
    complaintSecondStatus:{
        type:String,
        default:"Not Processed",
    },
    user: {
        type: mongoose.Types.ObjectId, // Use Types.ObjectId for better practice
        ref: "Users", // Reference the User model
    },
},
{ timestamps: true }
)

const CommonArea = models.CommonArea || model('CommonArea',commonareaSchema);
export default CommonArea;
