import mongoose, { Schema,model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const facultySchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  isRector: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  isHighAuth: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

// secure the password
facultySchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    console.log("Password is not modified");
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    console.log("Password hashed successfully");
    next();
  } catch (error) {
    console.log("Error during password hashing:", error);
  }
});

// Compare bcrypt password

facultySchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// JSON WEB TOKEN
facultySchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userID: this._id.toString(),  // Use _id instead of userId
                username: this.username,
                email:this.email,
                isRector: this.isRector,
                isHighAuth: this.isHighAuth,
            },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "30d",
            }
        );
      // return token;
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Token generation failed");
    }
  };

  const Faculty = (() => {
    try {
      // Return the existing model if it is already compiled
      return model("Faculty");
    } catch {
      // Otherwise, define and return the new model
      return model("Faculty", facultySchema);
    }
  })();


// const Faculty =model("Faculty", facultySchema);
export default Faculty;
