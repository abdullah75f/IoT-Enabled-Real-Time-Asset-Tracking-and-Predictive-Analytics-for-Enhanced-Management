import axios from "axios";
import store from "../../store/store";

const api = axios.create({
  baseURL: "http://192.168.1.4:3000",
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
    throw (
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

export default api;
