import React from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  User,
  FolderKanban,
  Lightbulb,
  AlertTriangle,
  Shield,
  LogOut,
  Moon,
  Sun,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FeedPage from '@/pages/FeedPage';
import ProfilePage from '@/pages/ProfilePage';
import ProjectsPage from '@/pages/ProjectsPage';
import SuggestionsPage from '@/pages/SuggestionsPage';
import ProblemsPage from '@/pages/ProblemsPage';
import AdminPage from '@/pages/AdminPage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';
import MessagesPage from '@/pages/MessagesPage';
import ConversationPage from '@/pages/ConversationPage';
import NotificationBell from '@/components/NotificationBell';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { useMessaging } from '@/contexts/MessagingContext';

const navItems = [
  { path: '/', name: 'Inicio', icon: Home },
  { path: '/announcements', name: 'Anuncios', icon: Megaphone, badge: true },
  { path: '/messages', name: 'Mensajes', icon: MessageSquare, badge: true },
  { path: '/profile', name: 'Mi Perfil', icon: User },
  { path: '/projects', name: 'Proyectos', icon: FolderKanban },
  { path: '/suggestions', name: 'Sugerencias', icon: Lightbulb },
  { path: '/problems', name: 'Problemáticas', icon: AlertTriangle },
];

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useAnnouncements();
  const { unreadMessagesCount } = useMessaging();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Avatar>
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
              {currentUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-100">{currentUser?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.role}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard${item.path}`}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && item.name === 'Anuncios' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {item.badge && item.name === 'Mensajes' && unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </NavLink>
          ))}
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 mr-3" />
            ) : (
              <Sun className="w-5 h-5 mr-3" />
            )}
            Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <NotificationBell />
        </div>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:conversationId" element={<ConversationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            {currentUser?.role === 'admin' && <Route path="/admin" element={<AdminPage />} />}
          </Routes>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
