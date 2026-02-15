import Question from "@MOLDS/Question";
import mongoose from "mongoose";

async function removeUniqueIndex() {
  // اتصال به دیتابیس با MONGO_URI
  await mongoose.connect("mongodb+srv://arshia015:arshia015@cofi.gopeffq.mongodb.net/mydatabase");
  console.log("Connected to MongoDB");

  // نمایش indexهای فعلی
  console.log("Existing Indexes:", await Question.collection.getIndexes());

  // حذف index یکتا روی userId + productId
  try {
    await Question.collection.dropIndex("userId_1_productId_1");
    console.log("Unique index removed successfully");
  } catch (err: any) {
    console.log("No unique index to remove or already removed");
  }

  // ایجاد index غیر یکتا (اختیاری ولی توصیه می‌شود برای سرعت)
  await Question.collection.createIndex({ userId: 1, productId: 1 });
  console.log("Non-unique index created");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

// اجرا
removeUniqueIndex().catch(console.error);
