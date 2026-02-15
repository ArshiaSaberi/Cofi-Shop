import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ چند پاسخ مدیریتی
  answers: [
    {
      text: { type: String, required: true },
      answeredAt: { type: Date, default: Date.now },

      answeredBy: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        firstname: String,
        lastname: String,
        email: String,
        role: String,
      },
    },
  ],

  isActive: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
