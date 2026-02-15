import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Product Schema
|--------------------------------------------------------------------------
| این اسکیما اطلاعات محصول را نگه می‌دارد.
| ارتباط با Cart به‌صورت Virtual تعریف شده
|--------------------------------------------------------------------------
*/

const ProdouctSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String },
    description: { type: String },

    price: { type: Number, required: true },
    finalPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },

    images: { type: [String], default: [] },
    count: { type: Number, default: 0 },

    coffeeBlend: {
      type: {
        arabica: String,
        robusta: String,
      },
    },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* -------------------------------------------------------------------------- */
/*                         Virtual Relation: Product → Cart                    */
/* -------------------------------------------------------------------------- */

/*
  این Virtual می‌گوید:
  این محصول ممکن است داخل چند سبد خرید وجود داشته باشد
*/
ProdouctSchema.virtual("carts", {
  ref: "Cart", // مدل مقصد
  localField: "_id", // شناسه محصول
  foreignField: "items.product", // فیلدی که داخل Cart به Product اشاره می‌کند
  justOne: false, // چون یک محصول می‌تواند در چند سبد باشد
});






export default mongoose.models.Prodouct ||
  mongoose.model("Prodouct", ProdouctSchema);
