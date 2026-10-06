// ==========================================
// API BASE URL
// ==========================================
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ==========================================
// REGISTER
// ==========================================
export const registerUser = async (userData) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed."
    );
  }

  return data;
};

// ==========================================
// LOGIN
// ==========================================
export const loginUser = async (credentials) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

  return data;
};

// ==========================================
// GET CURRENT USER
// ==========================================
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch current user."
    );
  }

  return data;
};

// ==========================================
// GET MY PROFILE
// ==========================================
export const getMyProfile = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch profile."
    );
  }

  return data;
};

// ==========================================
// UPDATE MY PROFILE
// ==========================================
export const updateMyProfile = async (
  profileData
) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update profile."
    );
  }

  return data;
};

// ==========================================
// GET ALL EDUCATORS
// ==========================================
export const getEducators = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/educators`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch educators."
    );
  }

  return data;
};

// ==========================================
// GET EDUCATOR BY ID
// ==========================================
export const getEducatorById = async (id) => {
  if (!id) {
    throw new Error(
      "Educator ID is required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/users/educators/${id}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch educator profile."
    );
  }

  return data;
};

// ==========================================
// CREATE INTEREST REQUEST
// ==========================================
export const createInterestRequest = async (
  educatorId,
  message = ""
) => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error(
      "Please log in as a family to send an interest request."
    );
  }

  if (!educatorId) {
    throw new Error(
      "Educator ID is required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        educatorId,
        message: message.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send interest request."
    );
  }

  return data;
};

// ==========================================
// GET FAMILY REQUESTS
// ==========================================
export const getFamilyRequests = async () => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/requests/family`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch family requests."
    );
  }

  return data;
};

// ==========================================
// GET EDUCATOR REQUESTS
// ==========================================
export const getEducatorRequests = async () => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/requests/educator`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch educator requests."
    );
  }

  return data;
};

// ==========================================
// UPDATE REQUEST STATUS
// ==========================================
export const updateRequestStatus = async (
  requestId,
  status
) => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error("Authentication required.");
  }

  if (!requestId) {
    throw new Error(
      "Request ID is required."
    );
  }

  const allowedStatuses = [
    "pending",
    "accepted",
    "rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Invalid request status."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update request."
    );
  }

  return data;
};

// ==========================================
// GET MESSAGES
// ==========================================
export const getMessages = async (
  requestId
) => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error("Authentication required.");
  }

  if (!requestId) {
    throw new Error(
      "Request ID is required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/messages`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load messages."
    );
  }

  return data;
};

// ==========================================
// SEND MESSAGE
// ==========================================
export const sendMessage = async (
  requestId,
  message
) => {
  const token = localStorage.getItem(
    "authToken"
  );

  if (!token) {
    throw new Error("Authentication required.");
  }

  if (!requestId) {
    throw new Error(
      "Request ID is required."
    );
  }

  if (!message || !message.trim()) {
    throw new Error(
      "Message cannot be empty."
    );
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length > 2000) {
    throw new Error(
      "Message cannot exceed 2000 characters."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: trimmedMessage,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send message."
    );
  }

  return data;
};

// ==========================================
// LOGOUT
// ==========================================
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("familyUser");
  localStorage.removeItem("educatorUser");
};