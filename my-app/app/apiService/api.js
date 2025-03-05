import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.8:3000",
});

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
    const response = await api.post("/users/signin", credentials);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "An error occurred while signing in."
    );
  }
};

export const uploadProfilePicture = async (formData) => {
  formData.append("userId", userId);
  formData.append("file", fileInput.files[0]);

  try {
    const response = await api.post("/users/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export default api;
