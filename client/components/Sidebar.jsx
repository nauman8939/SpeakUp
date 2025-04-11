import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  Home,
  PlusSquare,
  BookOpen,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { user, logout } = useUser();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/createBlog', icon: PlusSquare, label: 'Create', protected: true },
    { path: '/my-posts', icon: BookOpen, label: 'My Posts', protected: true },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-xl z-50 transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
              } p-4 border-b border-gray-100 h-16`}
          >
            {!isCollapsed && (
              <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              SpeakUp
            </Link>
            )}
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 lg:hidden"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={toggleCollapse}
                className="hidden lg:block p-1 rounded-full hover:bg-gray-100 text-gray-500"
                data-tooltip-id="collapse-tooltip"
                data-tooltip-content={isCollapsed ? 'Expand' : 'Collapse'}
              >
                {isCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map(
                (item) =>
                  (!item.protected || user) && (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center rounded-lg transition-all
                          ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'}
                          ${location.pathname === item.path
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'}`}
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content={item.label}
                      >
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </nav>

          
        </div>
      </div>

      <Tooltip id="sidebar-tooltip" place="right" effect="solid" />
      <Tooltip id="collapse-tooltip" place="right" effect="solid" />
    </>
  );
};

export default Sidebar;
