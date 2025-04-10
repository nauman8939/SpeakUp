import { registerUser , loginUser } from "../models/authModel";
import { useUser } from "../context/UserContext";



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
