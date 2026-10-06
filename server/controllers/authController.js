const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// REGISTER
// ==========================================
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      language,
      childAge,
      requirements,
      education,
      experience,
      skills,
      location,
      about,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    if (!["family", "educator"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either family or educator.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      password: hashedPassword,
      role,
      language: language?.trim(),
      childAge: childAge?.trim(),
      requirements: requirements?.trim(),
      education: education?.trim(),
      experience: experience?.trim(),
      skills: Array.isArray(skills) ? skills : [],
      location: location?.trim(),
      about: about?.trim(),
    });

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Server error while fetching user.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};