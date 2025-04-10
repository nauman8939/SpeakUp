import axios from "../src/api/axios";
import CryptoJS from "crypto-js";

export const registerUser = async (data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      import.meta.env.VITE_SECRET_KEY
    ).toString();

    const response = await axios.post("/auth/register", { payload: encryptedData });
    return response.data;
  } catch (error) {
    throw error;
  }
};
