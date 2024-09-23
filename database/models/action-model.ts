import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

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
        ref: "Users", 
    },
    highAuth:{
        type: mongoose.Types.ObjectId, 
        ref: "Facultys", 
    }

},
{ timestamps: true }
);

const ActionTake = models.ActionTake || model('ActionTake',actionSchema);
export default ActionTake;
