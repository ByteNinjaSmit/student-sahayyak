import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

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
        ref: "Users",
    },

},
{ timestamps: true }
);

const FoodOwner = models.FoodOwner || model('FoodOwner',foodownerSchema);
export default FoodOwner;
