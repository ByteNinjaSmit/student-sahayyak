import { Schema,model,models } from "mongoose"; 

const corridorSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
    },
    complaintStatus:{
        type:String,
        default:"Not Processed",
    },
    image:{
        type:String,
        // required:true,
    }
})

const Corridor = models.Corridor || model('Corridor',corridorSchema);
export default Corridor;
