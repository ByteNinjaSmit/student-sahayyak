import mongoose, { Schema,model } from "mongoose";

const foodqualitySchema = new Schema({
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
        // It is Hygene
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

const FoodQuality = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('FoodQuality');
    } catch {
      // Otherwise, define and return the new model
      return model('FoodQuality',foodqualitySchema);
    }
  })();


// const FoodQuality = model('FoodQuality',foodqualitySchema);
export default FoodQuality;