import mongoose, { Schema,model } from "mongoose";
const drinkwaterSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
        // It is Array
        // Quality
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

const DrinkWater = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('DrinkWater');
    } catch {
      // Otherwise, define and return the new model
      return model('DrinkWater',drinkwaterSchema);
    }
  })();


// const DrinkWater = model('DrinkWater',drinkwaterSchema);
export default DrinkWater;
