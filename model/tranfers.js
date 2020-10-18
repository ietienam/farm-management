const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    transfer_id: {
      type: String,
      required: [true, "A transfer must have a transfer_id"],
    },
    order_id: {
      type: String,
      required: [true, "A transfer must have an order_id"]
    },
    is_delivered: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: String,
      required: [true, "A transfer must have a destination"],
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
  },
  {
    timestamps: true,
  }
);

const Transfer = mongoose.model("Trasfer", transferSchema);

module.exports = Transfer;
