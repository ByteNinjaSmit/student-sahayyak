import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

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
        ref: "Users", // Reference the User model
    },
},
{ timestamps: true }
);

const DrinkWater = models.DrinkWater || model('DrinkWater',drinkwaterSchema);
export default DrinkWater;
