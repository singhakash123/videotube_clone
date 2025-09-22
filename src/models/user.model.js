import mongoose, { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // important for security
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    avatar: {
      type: String, // from cloudinary
      required: true,
    },

    coverimage: {
      type: String, // from cloudinary
    },

    watchHistory: [
      {
        type: Types.ObjectId,
        ref: "Video",
        required: true,
      },
    ],

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
    },

    refreshtoken: {
      type: String,
      default: null, // ✅ better than required
    },
  },
  {
    timestamps: true,
  }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔑 Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRETKEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_DATE,
    }
  );
};

// 🔑 Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRETKEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY_DATE,
    }
  );
};

export const User = mongoose.model("User", userSchema);
