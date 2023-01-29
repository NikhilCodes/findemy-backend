import mongoose, { Schema } from "mongoose";

export const Enroll = mongoose.model("Enroll", new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
}, { timestamps: true }));
