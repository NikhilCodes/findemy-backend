// Mongoose connection
import mongoose from "mongoose";

export const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.DB_URI);
  console.log(`Connected to database`);
}
