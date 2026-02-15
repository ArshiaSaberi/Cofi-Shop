import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Cart Schema
|--------------------------------------------------------------------------
| این اسکیما نمایانگر سبد خرید هر کاربر است.
| ارتباط با Product به صورت Virtual اضافه شده است
|--------------------------------------------------------------------------
*/

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prodouct",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],                                                                

    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* -------------------------------------------------------------------------- */
/*                               Virtual Fields                               */
/* -------------------------------------------------------------------------- */

// 🧮 مجموع قیمت کل سبد
CartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.quantity * item.finalPrice,
    0
  );
});

// 📦 مجموع تعداد کل محصولات
CartSchema.virtual("totalQuantity").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// 🔗 Virtual Relation: Cart → Product
// این Virtual اجازه می‌دهد که همه جزئیات Productها را هنگام populate Cart ببینیم
CartSchema.virtual("products", {
  ref: "Prodouct",                 // مدل مقصد
  localField: "items.product",     // شناسه محصول در Cart
  foreignField: "_id",             // فیلد _id در Product
  justOne: false,                  // چند محصول
});

const Cart =
  mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
