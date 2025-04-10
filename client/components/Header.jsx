import { Link } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full py-2 px-3 flex justify-between items-center">
        {/* Logo Text Only */}
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          SpeakUp
        </Link>

        {!user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="border border-gray-300 px-3 py-1.5 rounded-md text-gray-700 hover:border-blue-600 hover:text-blue-600 font-medium transition text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={user.avatar || "/default-profile.png"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-800 text-sm sm:text-base">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
