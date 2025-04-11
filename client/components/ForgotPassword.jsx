import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { handleForgotPassword } from "../controllers/authController"; 

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setIsLoading(true);

    const result = await handleForgotPassword(email);

    if (result.success) {
      toast.success(result.message || "Password reset link sent to your email!");
      navigate("/login", { state: { email } });
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-3 text-gray-500">
                <Mail size={20} />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
