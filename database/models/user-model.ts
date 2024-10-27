import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  username: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  hostelId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// secure the password
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    console.log("Password is not modified");
    return next(); // Added return here
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

// Compare bcrypt password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// JSON WEB TOKEN
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userID: this._id.toString(),
        room: this.room,
        hostelId: this.hostelId,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};
// Define the User model if it doesn't exist already
// Define the User model directly (no conditionals)
// Singleton pattern for model definition
const User = (() => {
  try {
    // Check if the model is already compiled
    return model("User");
  } catch {
    // If not compiled, create and return the model
    return model("User", userSchema);
  }
})();

export default User;
