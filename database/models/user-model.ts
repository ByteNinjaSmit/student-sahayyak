import { Schema,model,models } from "mongoose"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
      type: String,
      required: true,
      unique: true,
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
      console.log('Password is not modified');
      next();
  }

  try {
      const saltRound = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(user.password, saltRound);
      user.password = hash_password;
      console.log('Password hashed successfully');
      next();
  } catch (error) {
      console.log('Error during password hashing:', error);
      next(error);
  }
});


// Compare bcrypt password

userSchema.methods.comparePassword = async function (password:string) {
    return bcrypt.compare(password, this.password);
  };

// JSON WEB TOKEN
userSchema.methods.generateToken = async function () {
  try {
      return jwt.sign(
          {
              userID: this._id.toString(),  // Use _id instead of userId
              username: this.username,
              hostelId: this.hostelId,
          },
          process.env.JWT_SECRET_KEY as string,
          {
              expiresIn: "1h",
          }
      );
    // return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Token generation failed");
  }
};

const User = models.User || model('User',userSchema);

export default User;
