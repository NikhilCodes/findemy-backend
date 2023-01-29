import mongoose, { Schema } from "mongoose";

export const Cart = mongoose.model("Cart", new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
}, { timestamps: true }));
