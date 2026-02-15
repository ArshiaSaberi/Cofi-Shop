import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema(
  {
    term: { type: String, unique: true },
    count: { type: Number, default: 1 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Search || mongoose.model("Search", SearchSchema);
