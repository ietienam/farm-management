var mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, 'A coupon must have a deductible value']
    },
    coupon: {
      type: String,
      required: [true, 'A coupon must have a string value'],
      unique: true
    },
    expires_at: {
      type: String, // format = MM/DD/YYYY
      required: [true, 'A coupon must have an expiry date']
    },
    coupon_status: {
      type: Boolean, //true = active  false = inactive
      required: true
    },
    used_at: {
      type: String, // MM/DD/YYYY
    }
  },
  { timestamps: true },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
