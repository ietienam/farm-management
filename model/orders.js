var mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: [true, "An Order must have a crop"],
    },
    order_id: {
      type: String,
      required: [true, "An Order must have a order_id"],
    },
    cost: {
      type: Number,
      required: [true, "An Order must have a cost"],
    },
    order_status: {
      type: Number,
      default: 0, // 0 = ordered, 1 = in transit, 2 = delivered, 3 = failed, 4 = cancelled
    },
    destination: {
      type: String,
      lowercase: true,
      required: [true, 'An order must have a destination']
    },
    from: {
      type: String,
      lowercase: true,
      required: [true, 'An order must have a from location']
    },
    seller: {
      type: String,
      required: [true, "An Order must have a seller"],
    },
    seller_contact: {
      type: Number,
      required: [true, "A seller must have a contact"],
    },
    seller_address: {
      type: String,
      required: [true, "A seller must have an address"],
    },
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

orderSchema.index({ order_status: 0 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ order_status: 2 });
orderSchema.index({ order_status: 3 });
orderSchema.index({ order_status: 4 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
