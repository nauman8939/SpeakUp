import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { UserPlus, LogOut, Menu } from 'lucide-react';
import LogoutModal from './LogoutModal';

export default function Header({ toggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    setModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setModalOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30 w-full h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        {/* Mobile hamburger icon (shown only if logged in) */}
        {user && (
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-blue-600 focus:outline-none lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {!user && (
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            SpeakUp
          </Link>
        )}
      </div>

      <div className="flex items-center ml-auto gap-2 sm:gap-4">
        {!user ? (
          <>
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
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </>
        ) : (
          <>
            <span className="font-medium text-gray-800 text-sm sm:text-base">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition p-2 rounded-md"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </>
        )}
      </div>

      <LogoutModal
        isOpen={isModalOpen}
        onConfirm={confirmLogout}
        onCancel={() => setModalOpen(false)}
      />
    </header>
  );
}
