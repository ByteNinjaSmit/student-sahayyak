import mongoose, { Schema,model } from "mongoose";

const actionSchema = new Schema({
    message:{
        type:String,
        required:true,
        // Description Long
    },
    from:{
        type:String,
        required:true,
        // Role
    },
    To:{
        type:String,
        required:true,
        // role
    },
    user: {
        type: mongoose.Types.ObjectId, 
        ref: "User", 
    },
    highAuth:{
        type: mongoose.Types.ObjectId, 
        ref: "Faculties", 
    }

},
{ timestamps: true }
);

const ActionTake = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('ActionTake');
    } catch {
      // Otherwise, define and return the new model
      return model('ActionTake',actionSchema);
    }
  })();


// const ActionTake =model('ActionTake',actionSchema);
export default ActionTake;
