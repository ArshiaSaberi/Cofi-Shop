import mongoose from "mongoose";

async function Conecttodb() {
  if (mongoose.connection.readyState) {
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

export default Conecttodb;
