import mongoose, { Schema,model } from "mongoose";

const facultycomplaintSchema = new Schema({
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
);

const FacultyComplaint = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('FacultyComplaint');
    } catch {
      // Otherwise, define and return the new model
      return model('FacultyComplaint',facultycomplaintSchema);
    }
  })();


// const FacultyComplaint = model('FacultyComplaint',facultycomplaintSchema);
export default FacultyComplaint;
