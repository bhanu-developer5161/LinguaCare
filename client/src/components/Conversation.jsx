import { useEffect, useState } from "react";
import {
  getMessages,
  sendMessage,
} from "../services/api";

function Conversation({ requestId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) {
      return;
    }

    loadMessages();
  }, [requestId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMessages(requestId);

      setMessages(data.messages || []);
    } catch (error) {
      console.error(
        "Conversation loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load conversation."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const data = await sendMessage(
        requestId,
        trimmedMessage
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        data.data,
      ]);

      setMessageText("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      setError(
        error.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (date) => {
    if (!date) {
      return "";
    }

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return "";
    }

    return messageDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <section className="conversation">
        <div className="conversation-header">
          <div>
            <span className="conversation-eyebrow">
              PRIVATE CONNECTION
            </span>

            <h3>Conversation</h3>

            <p>
              Your conversation is securely connected
              through LinguaCare.
            </p>
          </div>
        </div>

        <div className="conversation-loading">
          <div className="conversation-loading-dot" />
          <p>Loading conversation...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="conversation">
      {/* HEADER */}
      <div className="conversation-header">
        <div>
          <span className="conversation-eyebrow">
            PRIVATE CONNECTION
          </span>

          <h3>Conversation</h3>

          <p>
            Communicate securely through LinguaCare.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="conversation-refresh-button"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="conversation-error">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {/* MESSAGES */}
      <div className="conversation-messages">
        {messages.length === 0 ? (
          <div className="conversation-empty">
            <div className="conversation-empty-icon">
              💬
            </div>

            <h4>No messages yet</h4>

            <p>
              Start the conversation by sending a
              message below.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser =
              message.sender?._id === currentUserId;

            const senderName =
              `${message.sender?.firstName || ""} ${
                message.sender?.lastName || ""
              }`.trim() || "User";

            return (
              <div
                key={message._id}
                className={`conversation-message ${
                  isCurrentUser
                    ? "conversation-message-own"
                    : "conversation-message-other"
                }`}
              >
                <div className="conversation-message-header">
                  <strong>{senderName}</strong>

                  <span>
                    {formatMessageTime(
                      message.createdAt
                    )}
                  </span>
                </div>

                <p>{message.message}</p>
              </div>
            );
          })
        )}
      </div>

      {/* MESSAGE FORM */}
      <form
        onSubmit={handleSendMessage}
        className="conversation-form"
      >
        <label
          htmlFor={`message-${requestId}`}
        >
          Message
        </label>

        <textarea
          id={`message-${requestId}`}
          value={messageText}
          onChange={(event) =>
            setMessageText(event.target.value)
          }
          placeholder="Write a professional message..."
          maxLength={2000}
          rows={4}
          disabled={sending}
        />

        <div className="conversation-form-footer">
          <span className="conversation-character-count">
            {messageText.length}/2000
          </span>

          <button
            type="submit"
            className="conversation-send-button"
            disabled={
              sending || !messageText.trim()
            }
          >
            {sending
              ? "Sending..."
              : "Send Message"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Conversation;