import { registerUser , loginUser ,sendResetLink ,updatePassword} from "../models/authModel";
import { useUser } from "../context/UserContext";
import axios from "../src/api/axios";



export const handleRegister = async (form) => {
  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!");
    return { success: false, message: "Passwords do not match!" };
  }

  try {
    const result = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error?.response?.data?.msg || "Registration failed. Please try again.";
      
    return { success: false, message };
  }
};

export const handleLogin = async (form, setUser) => {  // Accept setUser as an argument
  try {
    const result = await loginUser({
      email: form.email,
      password: form.password,
    });

    console.log(result.message);  // Log result message

    // Update context with logged-in user data
    setUser(result.user);  // Update context with the logged-in user

    return { success: true, data: result };
  } catch (error) {
    const message = error?.response?.data?.msg || "Login failed. Please try again.";
    return { success: false, message };
  }
};

// Forgot Password Handler
export const handleForgotPassword = async (email) => {
  try {
    const result = await sendResetLink({ email });
    return { success: true, message: result.message };
  } catch (error) {
    const message =
      error?.response?.data?.msg ||
      "Failed to send password reset link. Please try again.";
    return { success: false, message };
  }
};

// Reset Password Handler
export const handleResetPassword = async (form) => {
  if (form.password !== form.confirmPassword) {
    return { success: false, message: "Passwords do not match!" };
  }

  try {
    const result = await updatePassword({
      email: form.email,
      password: form.password,
      token: form.token,
    });
    return { success: true, message: result.message };
  } catch (error) {
    const message =
      error?.response?.data?.msg ||
      "Failed to reset password. Please try again.";
    return { success: false, message };
  }
};

export const verifyAuthToken = async (token) => {
  try {
    const res = await axios.get(`/auth/verify-reset-token?token=${token}`);
    return { success: res.data.valid }; // 🔧 Use `valid`, not `success`
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
      console.log('Error:', error.message);
    }
    return { success: false };
  }
};