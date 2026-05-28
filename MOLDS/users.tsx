import mongoose from "mongoose";

export interface IUser {
  _id: string; // اضافه شد
  firstname: string;
  username: string;
  lastname: string;
  email: string;
  img: string;
  password: string;
  role: "user" | "admin";
}

// تعریف اسکیما
const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    username: { type: String, required: true },

    lastname: { type: String, required: true },
    img: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "user", // فیلدی که در Cart به User اشاره می‌کنه
  justOne: true, // هر User فقط یک Cart دارد
});
UserSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.virtual("question", {
  ref: "Question",
  localField: "_id",
  foreignField: "userId",
});

const modeluser = mongoose.models.User || mongoose.model("User", UserSchema);

export default modeluser;
