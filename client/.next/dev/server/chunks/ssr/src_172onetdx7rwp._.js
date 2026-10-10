(()=>{"use strict";module.exports = [
"[project]/src/app/login/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Login$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Login.jsx [app-ssr] (ecmascript)");
"use client";
;
;
function LoginPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Login$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/login/page.jsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/pages/Login.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Login() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        password: ""
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((previous)=>({
                ...previous,
                [name]: value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loginUser"])({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });
            const user = response?.user;
            const token = response?.token;
            if (!user || !token) {
                throw new Error("Login succeeded, but authentication data was not received.");
            }
            if (user.role !== "family" && user.role !== "educator") {
                localStorage.removeItem("authToken");
                localStorage.removeItem("familyUser");
                localStorage.removeItem("educatorUser");
                setError("Invalid account role.");
                return;
            }
            // Store the authentication token.
            localStorage.setItem("authToken", token);
            // Save the authenticated user's information.
            if (user.role === "family") {
                localStorage.setItem("familyUser", JSON.stringify(user));
                localStorage.removeItem("educatorUser");
                router.push("/family-dashboard");
                return;
            }
            if (user.role === "educator") {
                localStorage.setItem("educatorUser", JSON.stringify(user));
                localStorage.removeItem("familyUser");
                router.push("/educator-dashboard");
                return;
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Login failed. Please check your email and password.");
        } finally{
            setIsSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "login-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "login-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "login-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "eyebrow",
                            children: "WELCOME BACK"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Log in to LinguaCare"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Access your LinguaCare account and continue your journey."
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Login.jsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "login-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "login-email",
                                    children: "Email Address"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Login.jsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "login-email",
                                    type: "email",
                                    name: "email",
                                    placeholder: "you@example.com",
                                    value: formData.email,
                                    onChange: handleChange,
                                    autoComplete: "email",
                                    required: true,
                                    disabled: isSubmitting
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Login.jsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "login-password",
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Login.jsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "login-password",
                                    type: "password",
                                    name: "password",
                                    placeholder: "Enter your password",
                                    value: formData.password,
                                    onChange: handleChange,
                                    autoComplete: "current-password",
                                    required: true,
                                    disabled: isSubmitting
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Login.jsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "login-error",
                            role: "alert",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "login-button",
                            disabled: isSubmitting,
                            children: isSubmitting ? "Logging in..." : "Log In"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Login.jsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "login-register",
                    children: [
                        "Don't have an account?",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/register",
                            children: "Create an account"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Login.jsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Login.jsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/Login.jsx",
            lineNumber: 92,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/Login.jsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/services/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInterestRequest",
    ()=>createInterestRequest,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getEducatorById",
    ()=>getEducatorById,
    "getEducatorRequests",
    ()=>getEducatorRequests,
    "getEducators",
    ()=>getEducators,
    "getFamilyRequests",
    ()=>getFamilyRequests,
    "getMessages",
    ()=>getMessages,
    "getMyProfile",
    ()=>getMyProfile,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "registerUser",
    ()=>registerUser,
    "sendMessage",
    ()=>sendMessage,
    "updateMyProfile",
    ()=>updateMyProfile,
    "updateRequestStatus",
    ()=>updateRequestStatus
]);
// ==========================================
// LINGUACARE API CONFIGURATION
// Next.js frontend + existing Express backend
// ==========================================
const API_BASE_URL = ("TURBOPACK compile-time value", "https://linguacare-wrq5.onrender.com/api") || "http://localhost:5000/api";
// ==========================================
// SHARED API HELPERS
// ==========================================
const getAuthToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
};
const parseResponse = async (response, fallbackMessage)=>{
    let data = {};
    try {
        data = await response.json();
    } catch  {
        data = {};
    }
    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }
    return data;
};
const authenticatedFetch = async (url, options = {})=>{
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication required.");
    }
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    };
    return fetch(url, {
        ...options,
        headers
    });
};
const registerUser = async (userData)=>{
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    return parseResponse(response, "Registration failed.");
};
const loginUser = async (credentials)=>{
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return parseResponse(response, "Login failed.");
};
const getCurrentUser = async ()=>{
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`);
    return parseResponse(response, "Unable to fetch current user.");
};
const getMyProfile = async ()=>{
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`);
    return parseResponse(response, "Unable to fetch profile.");
};
const updateMyProfile = async (profileData)=>{
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
    });
    return parseResponse(response, "Unable to update profile.");
};
const getEducators = async ()=>{
    const response = await fetch(`${API_BASE_URL}/users/educators`);
    return parseResponse(response, "Unable to fetch educators.");
};
const getEducatorById = async (id)=>{
    if (!id) {
        throw new Error("Educator ID is required.");
    }
    const response = await fetch(`${API_BASE_URL}/users/educators/${encodeURIComponent(id)}`);
    return parseResponse(response, "Unable to fetch educator profile.");
};
const createInterestRequest = async (educatorId, message = "")=>{
    if (!educatorId) {
        throw new Error("Educator ID is required.");
    }
    const response = await authenticatedFetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            educatorId,
            message: message.trim()
        })
    });
    return parseResponse(response, "Unable to send interest request.");
};
const getFamilyRequests = async ()=>{
    const response = await authenticatedFetch(`${API_BASE_URL}/requests/family`);
    return parseResponse(response, "Unable to fetch family requests.");
};
const getEducatorRequests = async ()=>{
    const response = await authenticatedFetch(`${API_BASE_URL}/requests/educator`);
    return parseResponse(response, "Unable to fetch educator requests.");
};
const updateRequestStatus = async (requestId, status)=>{
    if (!requestId) {
        throw new Error("Request ID is required.");
    }
    const allowedStatuses = [
        "pending",
        "accepted",
        "rejected"
    ];
    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid request status.");
    }
    const response = await authenticatedFetch(`${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status
        })
    });
    return parseResponse(response, "Unable to update request.");
};
const getMessages = async (requestId)=>{
    if (!requestId) {
        throw new Error("Request ID is required.");
    }
    const response = await authenticatedFetch(`${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/messages`);
    return parseResponse(response, "Unable to load messages.");
};
const sendMessage = async (requestId, message)=>{
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
    const response = await authenticatedFetch(`${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: trimmedMessage
        })
    });
    return parseResponse(response, "Unable to send message.");
};
const logoutUser = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
};
}),
];})()

//# sourceMappingURL=src_172onetdx7rwp._.js.map