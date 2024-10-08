import mongoose, { Schema,model } from "mongoose";

const foodownerSchema = new Schema({
    foodOwner:{
        type:String,
        required:true,
    },
    service:{
        type:String,
        required:true,
    },
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
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

},
{ timestamps: true }
);

const FoodOwner = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('FoodOwner');
    } catch {
      // Otherwise, define and return the new model
      return model('FoodOwner',foodownerSchema);
    }
  })();


// const FoodOwner = model('FoodOwner',foodownerSchema);
export default FoodOwner;
