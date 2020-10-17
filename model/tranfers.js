const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: [true, "A transfer must have a crop"],
    },
    transfer_id: {
      type: String,
      required: [true, "A transfer must have a transfer_id"],
    },
    is_delivered: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: String,
      required: [true, 'A transfer must have a destination']
    }
  },
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
