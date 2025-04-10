import { registerUser } from "../models/authModel";

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
