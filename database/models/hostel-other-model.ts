import mongoose, { Schema,model } from "mongoose";

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
        ref: "User", // Reference the User model
    },
},
{ timestamps: true }
);

const HostelOther = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('HostelOther');
    } catch {
      // Otherwise, define and return the new model
      return model('HostelOther',hostelotherSchema);
    }
  })();

// const HostelOther = model('HostelOther',hostelotherSchema);
export default HostelOther;
