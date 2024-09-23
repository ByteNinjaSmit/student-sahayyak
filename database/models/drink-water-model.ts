import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const drinkwaterSchema = new Schema({
    complainfirst:{
        type:[String],
        required:true,
        // It is Array
        // Quality
    },
    complaintfirstStatus:{
        type:String,
        default:"Not Processed",
    },
    complainSecond:{
        type:[String],
        required:true,
        // It is Array
        // Availability
    },
    complaintSecondStatus:{
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
