const User = require("../models/User");

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Server error while fetching profile.",
    });
  }
};

// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================
const updateMyProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      language,
      childAge,
      requirements,
      education,
      experience,
      skills,
      location,
      about,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    if (firstName !== undefined) {
      user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      user.lastName = lastName.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (language !== undefined) {
      user.language = language.trim();
    }

    if (childAge !== undefined) {
      user.childAge = childAge.trim();
    }

    if (requirements !== undefined) {
      user.requirements = requirements.trim();
    }

    if (education !== undefined) {
      user.education = education.trim();
    }

    if (experience !== undefined) {
      user.experience = experience.trim();
    }

    if (skills !== undefined && Array.isArray(skills)) {
      user.skills = skills;
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (about !== undefined) {
      user.about = about.trim();
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();

    delete userResponse.password;

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Server error while updating profile.",
    });
  }
};

// ==========================================
// GET ALL EDUCATORS
// ==========================================
const getEducators = async (req, res) => {
  try {
    const educators = await User.find({
      role: "educator",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      educators,
    });
  } catch (error) {
    console.error("Get educators error:", error);

    return res.status(500).json({
      message: "Server error while fetching educators.",
    });
  }
};

// ==========================================
// GET EDUCATOR BY ID
// ==========================================
const getEducatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const educator = await User.findOne({
      _id: id,
      role: "educator",
    }).select("-password");

    if (!educator) {
      return res.status(404).json({
        message: "Educator not found.",
      });
    }

    return res.status(200).json({
      educator,
    });
  } catch (error) {
    console.error("Get educator by ID error:", error);

    return res.status(500).json({
      message: "Server error while fetching educator.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  getMyProfile,
  updateMyProfile,
  getEducators,
  getEducatorById,
};