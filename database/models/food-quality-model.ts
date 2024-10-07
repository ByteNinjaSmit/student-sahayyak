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
        ref: "Users",
    },

},
{ timestamps: true }
);

const FoodQuality = models.FoodQuality || model('FoodQuality',foodqualitySchema);
export default FoodQuality;