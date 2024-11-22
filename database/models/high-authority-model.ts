import mongoose, { Schema,model,Document  } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Define the interface for the Faculty document
interface FacultyDocument extends Document {
  _id:string;
  username: string;
  email: string;
  isRector: boolean;
  phone: string;
  hostelId?: string;
  isHighAuth: boolean;
  password: string;

  comparePassword(password: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

const facultySchema = new Schema<FacultyDocument>({
  username: {
    type: String,
    required: true,
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
  hostelId:{
    type:String,
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
  const user = this as FacultyDocument;

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


// Singleton pattern to ensure model is compiled only once
const Faculty = (() => {
  try {
    return model<FacultyDocument>("Faculty"); // Return the existing model if it exists
  } catch {
    return model<FacultyDocument>("Faculty", facultySchema); // Otherwise, create and return a new model
  }
})();

export default Faculty;