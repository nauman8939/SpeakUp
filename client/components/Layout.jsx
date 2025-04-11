import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUser } from '../context/UserContext'; 

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {user && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      )}

      <div className={`flex-1 transition-all duration-300 ${user ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-64') : ''}`}>
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarCollapsed={isCollapsed}
        />
        <main className="p-4 md:p-6 overflow-auto h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
