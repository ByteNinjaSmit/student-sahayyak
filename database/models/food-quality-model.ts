import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const foodqualitySchema = new Schema({
    foodOwner:{
        type:String,
        required:true,
    },
    service:{
        type:String,
        required:true,
    },
    complainfirst:{
        type:[String],
        required:true,
        // It is Hygene
    },
    complaintfirstStatus:{
        type:String,
        default:"Not Processed",
    },
    complainsecond:{
        type:[String],
        required:true,
        // It is Quality
    },
    complaintsecondStatus:{
        type:String,
        default:"Not Processed",
    },
    complainthird:{
        type:[String],
        required:true,
        // Quanity
    },
    complaintthirdStatus:{
        type:String,
        default:"Not Processed",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
    },

},
{ timestamps: true }
);

const FoodQuality = models.FoodQuality || model('FoodQuality',foodqualitySchema);
export default FoodQuality;