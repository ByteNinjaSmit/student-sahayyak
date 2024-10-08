import mongoose, { Schema,model } from "mongoose";

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
        ref: "User", // Reference the User model
    },
},
{ timestamps: true }
);

// Singleton pattern for Safety model definition
const NetworkConn = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('NetworkConn');
    } catch {
      // Otherwise, define and return the new model
      return model('NetworkConn',networkconnSchema);
    }
  })();

// const NetworkConn = model('NetworkConn',networkconnSchema);
export default NetworkConn;
