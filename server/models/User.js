const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["family", "educator"],
      required: true,
    },

    // Family-specific fields
    language: {
      type: String,
      trim: true,
    },

    childAge: {
      type: String,
      trim: true,
    },

    requirements: {
      type: String,
      trim: true,
    },

    // Educator-specific fields
    education: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;