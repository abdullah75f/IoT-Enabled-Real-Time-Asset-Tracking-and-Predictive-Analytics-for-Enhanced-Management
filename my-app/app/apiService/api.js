import axios from "axios";
import store from "../../store/store";

const api = axios.create({
  baseURL: "http://192.168.1.6:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().signIn.jwtToken;
    console.log("(NOBRIDGE) LOG Token from Redux in interceptor:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("(NOBRIDGE) LOG Request Config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchLocation = async () => {
  try {
    const response = await api.get("/assets/location");
    return response.data;
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Fetch location failed:",
      error.message,
      error.response?.data
    );
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/users/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const googleSignup = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/users/google-signup`, {
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google sign-up failed.");
  }
};

export const signInUser = async (credentials) => {
  try {
    console.log("(NOBRIDGE) LOG Sending sign-in request with:", credentials);
    const response = await api.post("/users/signin", credentials);
    console.log("(NOBRIDGE) LOG Sign-in response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Sign-in request failed:",
      error.message,
      error.code,
      error.config
    );
    if (error.response?.data?.message === "Invalid password") {
      throw new Error("Incorrect password. Please try again.");
    }
    throw new Error(
      error.response?.data?.message || "An error occurred while signing in."
    );
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    console.log("(NOBRIDGE) LOG Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("(NOBRIDGE) ERROR Error fetching user profile:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    console.log("(NOBRIDGE) LOG Starting upload with formData:", formData);
    const response = await api.put("/users/update-profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("(NOBRIDGE) LOG Upload Response:", response.data);
    return response.data; // { profilePicture: "cloudinary_url" }
  } catch (error) {
    console.error("(NOBRIDGE) ERROR Upload Error:", {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response ? error.response.data : null,
    });
    throw error;
  }
};

// Create geofence alert
export const createGeofenceAlert = async (alertData) => {
  try {
    const response = await api.post("/geofence/alert", alertData);
    console.log("(NOBRIDGE) LOG Geofence alert response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Failed to send geofence alert:",
      error.message,
      error.response?.data
    );
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put("/users/update-profile", userData);
    console.log("(NOBRIDGE) LOG Update Profile Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Failed to update user profile:",
      error.message,
      error.response?.data
    );
    throw error;
  }
};

/**
 * Sends a request to initiate the password reset process.
 * @param {string} email - The user's email address.
 * @returns {Promise<object>} - Promise resolving to the response data (e.g., { message: "..." })
 */
export const requestPasswordReset = async (email) => {
  try {
    console.log("(NOBRIDGE) LOG Requesting password reset for:", email);
    const response = await api.post("/users/forgot-password", { email });
    console.log("(NOBRIDGE) LOG Forgot Password Response:", response.data);
    return response.data; // Should contain a message like { message: "..." }
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Failed to request password reset:",
      error.message,
      error.response?.data
    );
    // Rethrow a more specific error or the backend's message
    throw new Error(
      error.response?.data?.message || "Could not request password reset."
    );
  }
};

/**
 * Sends the reset token and new password to the backend.
 * @param {string} token - The password reset token received via email.
 * @param {string} newPassword - The user's desired new password.
 * @returns {Promise<object>} - Promise resolving to the response data (e.g., { message: "..." })
 */
export const resetPassword = async (token, newPassword) => {
  try {
    console.log("(NOBRIDGE) LOG Attempting to reset password with token."); // Don't log token itself
    const response = await api.post("/users/reset-password", {
      token,
      newPassword,
    });
    console.log("(NOBRIDGE) LOG Reset Password Response:", response.data);
    return response.data; // Should contain a message like { message: "..." }
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Failed to reset password:",
      error.message,
      error.response?.data
    );
    // Rethrow a more specific error or the backend's message
    throw new Error(
      error.response?.data?.message || "Could not reset password."
    );
  }
};

export const createCar = async (carName, carValue) => {
  try {
    const response = await api.post("/vehicle-readings/car-name", {
      carName: carName,
      carValue: carValue
    });
    return response.data;
  } catch (error) {
    console.error("Error creating car:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCarNamesFromDB = async () => {
  try {
    const response = await api.get("/vehicle-readings/cars");
    return response.data; // Array of car names
  } catch (error) {
    console.error(
      "Failed to fetch cars:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchLatestReading = async () => {
  try {
    const response = await api.get("/vehicle-readings/latest");
    return response.data;
  } catch (error) {
    console.error(
      "(NOBRIDGE) ERROR Failed to fetch latest vehicle reading:",
      error.message,
      error.response?.data
    );
    throw error;
  }
};

export const fetchBreachesByCarName = async (carName) => {
  try {
    const response = await api.get(`/geofence/breaches/${carName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching breaches by car:", error);
    throw error;
  }
};

export const fetchBreachDetails = async (carName) => {
  try {
    const response = await api.get(`/geofence/breach-details/${carName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching breach details:", error);
    throw error;
  }
};

export const fetchCarValues = async () => {
  try {
    const response = await api.get("/vehicle-readings/car-values");
    return response.data;
  } catch (error) {
    console.error("Error fetching car values:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
