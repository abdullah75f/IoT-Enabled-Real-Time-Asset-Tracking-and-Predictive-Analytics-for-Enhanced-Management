import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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

export const uploadProfilePicture = async (formData) => {
  formData.append("userId", userId); // Ensure userId is correctly set
  console.log('hiii userId:', userId); // Check if it's valid

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
