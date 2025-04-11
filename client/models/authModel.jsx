import axios from "../src/api/axios";
import CryptoJS from "crypto-js";

export const registerUser = async (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  const response = await axios.post("/auth/register", { payload: encryptedData });
  return response.data;
};

export const loginUser = async (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  const response = await axios.post("/auth/login", { payload: encryptedData }, { withCredentials: true });
  return response.data;

};

export const sendResetLink = async (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  const response = await axios.post("/auth/forgot-password", { payload: encryptedData });
  return response.data;
};

export const updatePassword = async (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  const response = await axios.post("/auth/reset-password", { payload: encryptedData });
  return response.data;
};
