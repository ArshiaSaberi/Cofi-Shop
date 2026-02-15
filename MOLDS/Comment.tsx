// models/Comment.js
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true }, // متن کامنت
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  Like: { type: Number, default: 0 },
  Dislike: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
