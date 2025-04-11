import { useState } from "react";
import { handleRegister } from "../controllers/authController";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = form;

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else {
      if (password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
        newErrors.password = "Must include capital letter and a number";
    }

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await handleRegister(form);
    setIsSubmitting(false);

    if (result?.success) {
      setOpenSuccessDialog(true);
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } else {
      toast.error(result?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mb-6">Join our community today</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <InputField
              label="Full Name"
              name="name"
              type="text"
              icon={<User />}
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            {/* Email */}
            <InputField
              label="Email address"
              name="email"
              type="email"
              icon={<Mail />}
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock />}
              toggleIcon
              show={showPassword}
              setShow={setShowPassword}
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={<Lock />}
              toggleIcon
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-md transition font-medium ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Please wait...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-xl shadow-lg p-6">
            <Dialog.Title className="text-xl font-semibold text-green-600">Registration Successful</Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-700">
              Your account has been created. Please log in to continue.
            </Dialog.Description>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function InputField({
  label,
  name,
  type,
  icon,
  toggleIcon = false,
  show,
  setShow,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-2.5 text-gray-400 w-5 h-5">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className={`pl-10 pr-10 w-full py-2.5 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-400" : "focus:ring-blue-500"
          }`}
        />
        {toggleIcon && (
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
