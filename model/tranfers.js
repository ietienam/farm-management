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
    transfer_status: {
      type: Number,
      default: 0, // 0 = ordered, 1 = in transit, 2 = delivered, 3 = failed
    },
    destination: {
      type: String,
      lowercase: true,
      default: 'abuja',
      //required: [true, "A transfer must have a destination"],
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
