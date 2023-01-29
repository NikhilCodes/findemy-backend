import mongoose, { Schema } from "mongoose";

export const Rating = mongoose.model("Rating", new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  rating: { type: Number, required: true },
  comment: String,
}, { timestamps: true }));
