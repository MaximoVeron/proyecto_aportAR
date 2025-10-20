import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    if (!currentUser) return;
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = allNotifications.filter(n => n.userId === currentUser.id && !n.read);
    setNotifications(userNotifications);
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const addNotification = (userId, message, link) => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      userId,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    allNotifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
    loadNotifications();
  };

  const markAsRead = (notificationId) => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notificationIndex = allNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex > -1) {
      allNotifications[notificationIndex].read = true;
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
      loadNotifications();
    }
  };
  
  const markAllAsRead = () => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.map(n => 
      n.userId === currentUser.id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    refreshNotifications: loadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}