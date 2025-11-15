// Use environment variable or fallback to direct backend URL
// This bypasses the Vite proxy and connects directly to Django backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem("access_token");
}

// Set auth tokens in localStorage
export function setAuthTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

// Clear auth tokens
export function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Get user from localStorage
export function getStoredUser(): any | null {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Set user in localStorage
export function setStoredUser(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Check if student is cleared
export async function checkClearance(studentId: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/alumni/status/${studentId}/`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to check status");
  return res.json();
}

// Request transcript
export async function requestTranscript(studentId: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/alumni/request-transcript/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) throw new Error("Failed to request transcript");
  return res.json();
}

// Helper function to parse error responses
async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      // Handle different error formats
      if (error.detail) return error.detail;
      if (error.message) return error.message;
      if (error.non_field_errors && Array.isArray(error.non_field_errors)) {
        return error.non_field_errors[0];
      }
      if (typeof error === "string") return error;
      // Handle field-specific errors
      const fieldErrors = Object.entries(error)
        .map(([field, messages]) => {
          const msgs = Array.isArray(messages) ? messages : [messages];
          return `${field}: ${msgs.join(", ")}`;
        })
        .join("; ");
      if (fieldErrors) return fieldErrors;
    }
    // If not JSON or parsing failed, return status text
    return `Server error: ${res.status} ${res.statusText}`;
  } catch (e) {
    return `Server error: ${res.status} ${res.statusText}`;
  }
}

// Register new alumni
export async function registerAlumni(data: {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: string;
  phone_number?: string;
  graduation_year?: number;
  student_id?: string;
  first_name?: string;
  last_name?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      role: data.role || "ALUMNI",
    }),
  });
  
  if (!res.ok) {
    const errorMessage = await parseErrorResponse(res);
    throw new Error(errorMessage);
  }
  
  const response = await res.json();
  
  // Store tokens and user data
  if (response.tokens) {
    setAuthTokens(response.tokens.access, response.tokens.refresh);
    setStoredUser(response.user);
  }
  
  return response;
}

// Login existing alumni
export async function loginAlumni(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  if (!res.ok) {
    const errorMessage = await parseErrorResponse(res);
    throw new Error(errorMessage);
  }
  
  const response = await res.json();
  
  // Store tokens and user data
  if (response.tokens) {
    setAuthTokens(response.tokens.access, response.tokens.refresh);
    setStoredUser(response.user);
  }
  
  return response;
}

// Get current user profile
export async function getProfile() {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  
  const res = await fetch(`${API_BASE}/auth/profile/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}

// Get user documents
export async function getDocuments() {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  
  const res = await fetch(`${API_BASE}/documents/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to get documents");
  return res.json();
}

// Download document
export async function downloadDocument(documentId: number) {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  
  const res = await fetch(`${API_BASE}/documents/${documentId}/download/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("You have outstanding fees. Please clear them to download documents.");
    }
    throw new Error("Failed to download document");
  }
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  // Get filename from Content-Disposition header or use default
  const contentDisposition = res.headers.get("Content-Disposition");
  let filename = `document-${documentId}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }
  
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
