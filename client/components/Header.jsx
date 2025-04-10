import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { UserPlus, LogOut } from "lucide-react";
import LogoutModal from "./LogoutModal";

export default function Header() {
  const { user, logout, loading } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    setModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logout(); // Wait for logout to complete
      setModalOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cancelLogout = () => {
    setModalOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full py-2 px-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          SpeakUp
        </Link>

        <div className="flex items-center gap-3">
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
              <span className="font-medium text-gray-800 text-sm sm:text-base">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition p-2 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </header>
  );
}
