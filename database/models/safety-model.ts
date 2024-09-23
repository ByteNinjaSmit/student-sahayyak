import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const safetySchema = new Schema({
    complainfirst:{
        type:[String],
        required:true,
        // It is Array
        // ragging Anti- ragging disturbance
    },
    complaintfirstStatus:{
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

const Safety = models.Safety || model('Safety',safetySchema);
export default Safety;
