import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["doctor", "receptionist"],
      required: true,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (password) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.generateAccessToken = function () {
  return JWT.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
