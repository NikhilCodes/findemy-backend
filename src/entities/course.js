import mongoose, { Schema } from "mongoose";

export const Course = mongoose.model("Course", new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  thumbnail: String,
  title: { type: String, required: true },
  totalHours: { type: Number, required: true },
  level: { type: String, required: true },
  lectures: Number,
  description: String,
  price: {
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
  },
  isBestSeller: { type: Boolean, default: false },
}, { timestamps: true }));
