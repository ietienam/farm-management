var mongoose = require("mongoose");

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
      default: 0, // 0 = ordered, 1 = in transit, 2 = delivered, 3 = failed, 4 = cancelled
    },
    destination: {
      type: String,
      lowercase: true,
      required: [true, "A transfer must have a destination"],
    },
    from: {
      type: String,
      lowercase: true,
      required: [true, 'A transfer must have a from location']
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
  },
  {
    timestamps: true,
  }
);

transferSchema.index({ order_status: 0 });
transferSchema.index({ order_status: 1 });
transferSchema.index({ order_status: 2 });
transferSchema.index({ order_status: 3 });
transferSchema.index({ order_status: 4 });

const Transfer = mongoose.model("Trasfer", transferSchema);

module.exports = Transfer;
