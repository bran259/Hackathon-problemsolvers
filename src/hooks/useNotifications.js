import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/notifications?userId=${user.id}&_sort=createdAt&_order=desc`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const createNotification = async (userId, workId, title, message) => {
    try {
      const notification = {
        userId,
        workId,
        title,
        message,
        read: false,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3001/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:3001/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    createNotification,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};