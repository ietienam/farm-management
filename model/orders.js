const mongoose = require("mongoose");

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
    is_delivered: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: String,
      default: "Benue",
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
