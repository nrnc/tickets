import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  console.log("Starting");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(error);
  }
  console.log("Connwcted to MongoDb");
  app.listen(3000, () => {
    console.log("Listening on Port 3000!!!!");
  });
};

start();
