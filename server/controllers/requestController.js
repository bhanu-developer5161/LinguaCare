const InterestRequest = require("../models/InterestRequest");
const User = require("../models/User");

// ==========================================
// CREATE INTEREST REQUEST
// ==========================================
const createRequest = async (req, res) => {
  try {
    const { educatorId, message } = req.body;

    if (!educatorId) {
      return res.status(400).json({
        message: "Educator ID is required.",
      });
    }

    const educator = await User.findOne({
      _id: educatorId,
      role: "educator",
    });

    if (!educator) {
      return res.status(404).json({
        message: "Educator not found.",
      });
    }

    if (req.user.role !== "family") {
      return res.status(403).json({
        message: "Only families can send interest requests.",
      });
    }

    const existingRequest = await InterestRequest.findOne({
      family: req.user.userId,
      educator: educatorId,
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You have already sent a request to this educator.",
      });
    }

    const request = await InterestRequest.create({
      family: req.user.userId,
      educator: educatorId,
      message: message?.trim() || "",
    });

    const populatedRequest = await InterestRequest.findById(request._id)
      .populate("family", "firstName lastName email phone language childAge requirements")
      .populate(
        "educator",
        "firstName lastName email language education experience location about skills"
      );

    return res.status(201).json({
      message: "Interest request sent successfully.",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);

    return res.status(500).json({
      message: "Server error while creating interest request.",
    });
  }
};

// ==========================================
// GET REQUESTS FOR EDUCATOR
// ==========================================
const getEducatorRequests = async (req, res) => {
  try {
    if (req.user.role !== "educator") {
      return res.status(403).json({
        message: "Only educators can view educator requests.",
      });
    }

    const requests = await InterestRequest.find({
      educator: req.user.userId,
    })
      .populate(
        "family",
        "firstName lastName email phone language childAge requirements"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get educator requests error:", error);

    return res.status(500).json({
      message: "Server error while fetching educator requests.",
    });
  }
};

// ==========================================
// GET REQUESTS FOR FAMILY
// ==========================================
const getFamilyRequests = async (req, res) => {
  try {
    if (req.user.role !== "family") {
      return res.status(403).json({
        message: "Only families can view family requests.",
      });
    }

    const requests = await InterestRequest.find({
      family: req.user.userId,
    })
      .populate(
        "educator",
        "firstName lastName email language education experience location about skills"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get family requests error:", error);

    return res.status(500).json({
      message: "Server error while fetching family requests.",
    });
  }
};

// ==========================================
// UPDATE REQUEST STATUS
// ==========================================
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected.",
      });
    }

    if (req.user.role !== "educator") {
      return res.status(403).json({
        message: "Only educators can update request status.",
      });
    }

    const request = await InterestRequest.findOne({
      _id: id,
      educator: req.user.userId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Interest request not found.",
      });
    }

    request.status = status;

    await request.save();

    const updatedRequest = await InterestRequest.findById(request._id)
      .populate(
        "family",
        "firstName lastName email phone language childAge requirements"
      )
      .populate(
        "educator",
        "firstName lastName email language education experience location about skills"
      );

    return res.status(200).json({
      message: `Request ${status} successfully.`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request status error:", error);

    return res.status(500).json({
      message: "Server error while updating request.",
    });
  }
};

module.exports = {
  createRequest,
  getEducatorRequests,
  getFamilyRequests,
  updateRequestStatus,
};