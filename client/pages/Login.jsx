import { useState } from "react";
import { handleLogin } from "../controllers/authController";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";  // Import useUser hook to update the user context

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser from context
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await handleLogin(form, setUser);  // Pass setUser to update context
    if (result.success) {
      toast.success("Login successful!");
      navigate("/home");  // Update path as per your routing
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        <p className="text-gray-500 mb-6">Welcome back, please sign in</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
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
