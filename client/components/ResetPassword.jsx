import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { handleResetPassword, verifyAuthToken } from "../controllers/authController";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null: loading, true: valid, false: invalid

  useEffect(() => {
    const verify = async () => {
      const result = await verifyAuthToken(token);
      setTokenValid(result.success);
    };

    if (token) verify();
    else setTokenValid(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleResetPassword({ password, confirmPassword, token });

      if (result.success) {
        toast.success("Password updated successfully!");
        navigate("/login");
      } else {
        setError(result.message);
      }
    } catch (err) {
      toast.error("Failed to update password");
      setError("Something went wrong");
    }

    setIsLoading(false);
  };

  if (tokenValid === null) {
    return <div className="text-center py-20 text-gray-600 text-lg">Verifying token...</div>;
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-600 mb-4">Please request a new password reset link.</p>
          <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mb-6">Create your new password</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {error.includes("Password") && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.includes("match") && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Update Password"}
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
