import mongoose from "mongoose"; 
import { Schema,model,models } from "mongoose"; 

const inboxSchema = new Schema({
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
        ref: "Faculties", 
    }

},
{ timestamps: true }
);

const Inbox = models.Inbox || model('Inbox',inboxSchema);
export default Inbox;
