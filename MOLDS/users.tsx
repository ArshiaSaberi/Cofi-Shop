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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔗 Virtual ارتباط User → Cart
UserSchema.virtual("cart", {
  ref: "Cart", // مدل مقصد
  localField: "_id", // فیلدی که در User به عنوان مرجع هست
  foreignField: "user", // فیلدی که در Cart به User اشاره می‌کنه
  justOne: true, // هر User فقط یک Cart دارد
});
// 🔗 Virtual User → Comments
UserSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "userId",

});

// 🔗 Virtual User → Questions
UserSchema.virtual("question", {
  ref: "Question",
  localField: "_id",
  foreignField: "userId",

});



const modeluser = mongoose.models.User || mongoose.model("User", UserSchema);

export default modeluser;
