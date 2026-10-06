const Message = require("../models/Message");
const InterestRequest = require("../models/InterestRequest");

const getAcceptedRequestForUser = async (requestId, userId) => {
  const request = await InterestRequest.findOne({
    _id: requestId,
    status: "accepted",
    $or: [
      { family: userId },
      { educator: userId },
    ],
  });

  return request;
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        message: "Message cannot exceed 2000 characters.",
      });
    }

    const request = await getAcceptedRequestForUser(
      requestId,
      req.user.userId
    );

    if (!request) {
      return res.status(403).json({
        message:
          "Messaging is available only to family and educator members of an accepted request.",
      });
    }

    const isFamily = request.family.toString() === req.user.userId;
    const receiver = isFamily
      ? request.educator
      : request.family;

    const newMessage = await Message.create({
      request: request._id,
      sender: req.user.userId,
      receiver,
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    )
      .populate(
        "sender",
        "firstName lastName email role"
      )
      .populate(
        "receiver",
        "firstName lastName email role"
      );

    return res.status(201).json({
      message: "Message sent successfully.",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      message: "Server error while sending message.",
    });
  }
};

// GET CONVERSATION
const getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await getAcceptedRequestForUser(
      requestId,
      req.user.userId
    );

    if (!request) {
      return res.status(403).json({
        message:
          "You do not have access to this conversation.",
      });
    }

    const messages = await Message.find({
      request: request._id,
    })
      .populate(
        "sender",
        "firstName lastName email role"
      )
      .populate(
        "receiver",
        "firstName lastName email role"
      )
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Server error while fetching messages.",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};