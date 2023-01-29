import mongoose, { Schema } from "mongoose";

export const User = mongoose.model("User", new Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  name: String,
  isCreator: { type: Boolean, default: false },
}, { timestamps: true }));
