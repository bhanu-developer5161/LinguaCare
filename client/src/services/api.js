// ==========================================
// LINGUACARE API CONFIGURATION
// Next.js frontend + existing Express backend
// ==========================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

// ==========================================
// SHARED API HELPERS
// ==========================================

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("authToken");
};

const parseResponse = async (response, fallbackMessage) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response, "Registration failed.");
};

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response, "Login failed.");
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`);

  return parseResponse(response, "Unable to fetch current user.");
};

// ==========================================
// GET MY PROFILE
// ==========================================

export const getMyProfile = async () => {
  const response = await authenticatedFetch(`${API_BASE_URL}/users/me`);

  return parseResponse(response, "Unable to fetch profile.");
};

// ==========================================
// UPDATE MY PROFILE
// ==========================================

export const updateMyProfile = async (profileData) => {
  const response = await authenticatedFetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  return parseResponse(response, "Unable to update profile.");
};

// ==========================================
// GET ALL EDUCATORS
// ==========================================

export const getEducators = async () => {
  const response = await fetch(`${API_BASE_URL}/users/educators`);

  return parseResponse(response, "Unable to fetch educators.");
};

// ==========================================
// GET EDUCATOR BY ID
// ==========================================

export const getEducatorById = async (id) => {
  if (!id) {
    throw new Error("Educator ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/users/educators/${encodeURIComponent(id)}`
  );

  return parseResponse(response, "Unable to fetch educator profile.");
};

// ==========================================
// CREATE INTEREST REQUEST
// ==========================================

export const createInterestRequest = async (
  educatorId,
  message = ""
) => {
  if (!educatorId) {
    throw new Error("Educator ID is required.");
  }

  const response = await authenticatedFetch(`${API_BASE_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      educatorId,
      message: message.trim(),
    }),
  });

  return parseResponse(response, "Unable to send interest request.");
};

// ==========================================
// GET FAMILY REQUESTS
// ==========================================

export const getFamilyRequests = async () => {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/requests/family`
  );

  return parseResponse(response, "Unable to fetch family requests.");
};

// ==========================================
// GET EDUCATOR REQUESTS
// ==========================================

export const getEducatorRequests = async () => {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/requests/educator`
  );

  return parseResponse(response, "Unable to fetch educator requests.");
};

// ==========================================
// UPDATE REQUEST STATUS
// Allowed values: pending, accepted, rejected
// ==========================================

export const updateRequestStatus = async (requestId, status) => {
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  const allowedStatuses = ["pending", "accepted", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid request status.");
  }

  const response = await authenticatedFetch(
    `${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return parseResponse(response, "Unable to update request.");
};

// ==========================================
// GET MESSAGES
// ==========================================

export const getMessages = async (requestId) => {
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  const response = await authenticatedFetch(
    `${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/messages`
  );

  return parseResponse(response, "Unable to load messages.");
};

// ==========================================
// SEND MESSAGE
// ==========================================

export const sendMessage = async (requestId, message) => {
  if (!requestId) {
    throw new Error("Request ID is required.");
  }

  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length > 2000) {
    throw new Error("Message cannot exceed 2000 characters.");
  }

  const response = await authenticatedFetch(
    `${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: trimmedMessage,
      }),
    }
  );

  return parseResponse(response, "Unable to send message.");
};

// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("authToken");
  localStorage.removeItem("familyUser");
  localStorage.removeItem("educatorUser");
};

