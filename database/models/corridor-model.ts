import mongoose, { Schema,model } from "mongoose";

const corridorSchema = new Schema({
    complaint:{
        type:[String],
        required:true,
    },
    status:{
        type:String,
        default:"Not Processed",
    },
    image:{
        type:String,
        // required:true,
    }
})

const Corridor = (() => {
    try {
      // Return the existing model if it is already compiled
      return model('Corridor');
    } catch {
      // Otherwise, define and return the new model
      return model('Corridor',corridorSchema);
    }
  })();

// const Corridor = model('Corridor',corridorSchema);
export default Corridor;
