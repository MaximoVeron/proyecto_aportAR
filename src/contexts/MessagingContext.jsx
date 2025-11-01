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
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const loadConversations = useCallback(() => {
    if (!currentUser) return;
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const userConversations = allConversations.filter((c) =>
      c.participants.includes(currentUser.id)
    );

    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const enrichedConversations = userConversations
      .map((conv) => {
        const otherParticipantId = conv.participants.find((p) => p !== currentUser.id);
        const otherUser = usersData.find((u) => u.id === otherParticipantId);
        const lastMessage = conv.messages[conv.messages.length - 1];
        return {
          ...conv,
          otherParticipant: {
            id: otherUser?.id,
            name: otherUser?.name || 'Usuario desconocido',
            avatar: otherUser?.avatar,
          },
          lastMessage: lastMessage || null,
        };
      })
      .sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
      });

    setConversations(enrichedConversations);

    const unreadCount = userConversations.reduce((count, conv) => {
      return (
        count + conv.messages.filter((m) => !m.read && m.recipientId === currentUser.id).length
      );
    }, 0);
    setUnreadMessagesCount(unreadCount);
  }, [currentUser]);

  useEffect(() => {
    loadConversations();

    // Polling para detectar cambios en localStorage cada 2 segundos
    const interval = setInterval(() => {
      if (!currentUser) return;

      const storedConversations = localStorage.getItem('conversations');
      if (storedConversations) {
        const conversationsData = JSON.parse(storedConversations);
        const userConversations = conversationsData.filter((c) =>
          c.participants.includes(currentUser.id)
        );

        if (userConversations.length > 0) {
          const lastModified = Math.max(
            ...userConversations.flatMap((conv) =>
              conv.messages.map((msg) => new Date(msg.timestamp).getTime())
            ),
            0
          );

          // Solo recargar si hay cambios nuevos
          if (lastModified > lastUpdate) {
            console.log('Detectado cambio en mensajes, actualizando...', {
              lastModified: new Date(lastModified),
              lastUpdate: new Date(lastUpdate)
            });
            setLastUpdate(lastModified);
            loadConversations();
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [loadConversations, lastUpdate, currentUser]);

  const getConversationById = (conversationId) => {
    return conversations.find((c) => c.id === conversationId);
  };

  const getConversationByIdFromStorage = (conversationId) => {
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const conversation = allConversations.find((c) => c.id === conversationId);

    if (!conversation) return null;

    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const otherParticipantId = conversation.participants.find((p) => p !== currentUser?.id);
    const otherUser = usersData.find((u) => u.id === otherParticipantId);

    return {
      ...conversation,
      otherParticipant: {
        id: otherUser?.id,
        name: otherUser?.name || 'Usuario desconocido',
        avatar: otherUser?.avatar,
      },
    };
  };

  const getConversationWithUser = (otherUserId) => {
    if (!currentUser) return null;
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    return allConversations.find(
      (c) => c.participants.includes(currentUser.id) && c.participants.includes(otherUserId)
    );
  };

  const sendMessage = (recipientId, content) => {
    if (!currentUser) return { success: false, error: 'No hay usuario autenticado' };

    // Validación de roles actualizada
    if (currentUser.role === 'estudiante') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const recipient = users.find((u) => u.id === recipientId);

      if (!recipient) {
        return { success: false, error: 'Usuario destinatario no encontrado' };
      }

      // Verificar que el destinatario tenga un rol permitido para estudiantes
      const allowedRoles = ['profesor', 'administrativo', 'admin'];
      if (!allowedRoles.includes(recipient.role)) {
        return {
          success: false,
          error: 'Solo puedes enviar mensajes a profesores, administrativos o administradores',
        };
      }
    }

    let allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    
    // Buscar conversación existente
    let conversationIndex = allConversations.findIndex(c => 
      c.participants.includes(currentUser.id) && c.participants.includes(recipientId)
    );

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    let conversationId;

    if (conversationIndex !== -1) {
      // Conversación existente
      allConversations[conversationIndex].messages.push(message);
      conversationId = allConversations[conversationIndex].id;
    } else {
      // Nueva conversación
      const newConversation = {
        id: `conv_${currentUser.id}_${recipientId}_${Date.now()}`,
        participants: [currentUser.id, recipientId],
        messages: [message],
      };
      allConversations.push(newConversation);
      conversationId = newConversation.id;
    }

    localStorage.setItem('conversations', JSON.stringify(allConversations));

    // Actualizar timestamp para disparar actualización inmediata
    setLastUpdate(Date.now());

    // Send notification
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const sender = users.find((u) => u.id === currentUser.id);
    addNotification(
      recipientId,
      `Nuevo mensaje de ${sender.name}`,
      `/dashboard/messages/${conversationId}`
    );

    // Forzar recarga inmediata
    loadConversations();
    
    return { success: true, conversationId };
  };

  const markConversationAsRead = (conversationId) => {
    if (!currentUser) return;
    let allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const convIndex = allConversations.findIndex((c) => c.id === conversationId);

    if (convIndex > -1) {
      let changed = false;
      allConversations[convIndex].messages.forEach((msg) => {
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
    return ['estudiante', 'profesor', 'administrativo', 'admin'].includes(currentUser?.role);
  };

  const createConversation = (otherUserId) => {
    if (!currentUser) return { success: false, error: 'No hay usuario autenticado' };

    // Verificar que el usuario pueda iniciar conversaciones
    if (!canInitiateConversation()) {
      return { success: false, error: 'No tienes permisos para iniciar conversaciones' };
    }

    // Verificar si ya existe una conversación
    const existingConversation = getConversationWithUser(otherUserId);
    if (existingConversation) {
      return { success: true, conversationId: existingConversation.id, existing: true };
    }

    // Crear nueva conversación vacía
    let allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const newConversation = {
      id: `conv_${currentUser.id}_${otherUserId}_${Date.now()}`,
      participants: [currentUser.id, otherUserId],
      messages: [],
    };

    allConversations.push(newConversation);
    localStorage.setItem('conversations', JSON.stringify(allConversations));

    loadConversations();
    return { success: true, conversationId: newConversation.id, existing: false };
  };

  const getContactableUsers = () => {
    if (!currentUser) return [];

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (currentUser.role === 'estudiante') {
      const allowedRoles = ['profesor', 'administrativo', 'admin'];
      return users.filter((user) => user.id !== currentUser.id && allowedRoles.includes(user.role));
    } else if (['profesor', 'administrativo', 'admin'].includes(currentUser.role)) {
      // Los roles privilegiados pueden contactar a cualquier usuario
      return users.filter((user) => user.id !== currentUser.id);
    }

    return [];
  };

  const value = {
    conversations,
    unreadMessagesCount,
    sendMessage,
    createConversation,
    getConversationById,
    getConversationByIdFromStorage,
    getConversationWithUser,
    markConversationAsRead,
    canInitiateConversation,
    getContactableUsers,
    refreshConversations: loadConversations,
  };

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}
