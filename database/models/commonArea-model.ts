import mongoose, { Schema,model } from "mongoose";

const commonareaSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
        // It is Array
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
)

const CommonArea = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('CommonArea');
    } catch {
      // Otherwise, define and return the new model
      return model('CommonArea',commonareaSchema);
    }
  })();

// const CommonArea = model('CommonArea',commonareaSchema);
export default CommonArea;
