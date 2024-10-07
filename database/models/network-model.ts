import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const networkconnSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
        // It is Array
        // Network Connectivity reliablity 
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

const NetworkConn = models.NetworkConn || model('NetworkConn',networkconnSchema);
export default NetworkConn;
