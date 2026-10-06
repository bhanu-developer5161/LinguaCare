const mongoose = require("mongoose");

const interestRequestSchema = new mongoose.Schema(
  {
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const InterestRequest = mongoose.model(
  "InterestRequest",
  interestRequestSchema
);

module.exports = InterestRequest;