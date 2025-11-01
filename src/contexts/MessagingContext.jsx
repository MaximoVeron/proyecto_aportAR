
    import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const MessagingContext = createContext();

export function useMessaging() {
  return useContext(MessagingContext);
}

export function MessagingProvider({ children }) {
  const { currentUser, getUserAvatar } = useAuth();
  const { addNotification } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const loadConversations = useCallback(() => {
    if (!currentUser) return;
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const userConversations = allConversations.filter(c => c.participants.includes(currentUser.id));

    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const enrichedConversations = userConversations.map(conv => {
      const otherParticipantId = conv.participants.find(p => p !== currentUser.id);
      const otherUser = usersData.find(u => u.id === otherParticipantId);
      const lastMessage = conv.messages[conv.messages.length - 1];
      return {
        ...conv,
        otherParticipant: {
          id: otherUser?.id,
          name: otherUser?.name || 'Usuario desconocido',
          avatar: otherUser?.avatar
        },
        lastMessage: lastMessage || null
      };
    }).sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
    
    setConversations(enrichedConversations);
    
    const unreadCount = userConversations.reduce((count, conv) => {
      return count + conv.messages.filter(m => !m.read && m.recipientId === currentUser.id).length;
    }, 0);
    setUnreadMessagesCount(unreadCount);

  }, [currentUser]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const getConversationById = (conversationId) => {
    return conversations.find(c => c.id === conversationId);
  };
  
  const getConversationWithUser = (otherUserId) => {
    if (!currentUser) return null;
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    return allConversations.find(c => c.participants.includes(currentUser.id) && c.participants.includes(otherUserId));
  };
  
  const sendMessage = (recipientId, content) => {
    if (!currentUser) return { success: false, error: 'No hay usuario autenticado' };
    
    // Validación de roles: solo estudiantes pueden iniciar conversaciones
    if (currentUser.role === 'estudiante') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const recipient = users.find(u => u.id === recipientId);
      
      if (!recipient) {
        return { success: false, error: 'Usuario destinatario no encontrado' };
      }
      
      // Verificar que el destinatario tenga un rol permitido
      const allowedRoles = ['profesor', 'administrativo', 'admin'];
      if (!allowedRoles.includes(recipient.role)) {
        return { success: false, error: 'Solo puedes enviar mensajes a profesores, administrativos o administradores' };
      }
    }
    
    let allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    let conversation = getConversationWithUser(recipientId);

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (conversation) {
      conversation.messages.push(message);
    } else {
      conversation = {
        id: `conv_${currentUser.id}_${recipientId}_${Date.now()}`,
        participants: [currentUser.id, recipientId],
        messages: [message]
      };
      allConversations.push(conversation);
    }
    
    localStorage.setItem('conversations', JSON.stringify(allConversations));
    
    // Send notification
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const sender = users.find(u => u.id === currentUser.id);
    addNotification(recipientId, `Nuevo mensaje de ${sender.name}`, `/dashboard/messages/${conversation.id}`);
    
    loadConversations();
    return { success: true, conversationId: conversation.id };
  };

  const markConversationAsRead = (conversationId) => {
    if (!currentUser) return;
    let allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const convIndex = allConversations.findIndex(c => c.id === conversationId);

    if (convIndex > -1) {
      let changed = false;
      allConversations[convIndex].messages.forEach(msg => {
        if (msg.recipientId === currentUser.id && !msg.read) {
          msg.read = true;
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem('conversations', JSON.stringify(allConversations));
        loadConversations();
      }
    }
  };

  const canInitiateConversation = () => {
    return currentUser?.role === 'estudiante';
  };

  const getContactableUsers = () => {
    if (!currentUser || currentUser.role !== 'estudiante') {
      return [];
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const allowedRoles = ['profesor', 'administrativo', 'admin'];
    
    return users.filter(user => 
      user.id !== currentUser.id && 
      allowedRoles.includes(user.role)
    );
  };

  const value = {
    conversations,
    unreadMessagesCount,
    sendMessage,
    getConversationById,
    getConversationWithUser,
    markConversationAsRead,
    canInitiateConversation,
    getContactableUsers,
    refreshConversations: loadConversations
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}
  