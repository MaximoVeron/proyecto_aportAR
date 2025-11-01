import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getConversationByIdFromStorage, sendMessage, markConversationAsRead } = useMessaging();
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Función para cargar la conversación desde localStorage
  const loadConversation = useCallback(() => {
    if (!conversationId) return;
    
    const conv = getConversationByIdFromStorage(conversationId);
    
    if (!conv) {
      setConversation(null);
      return;
    }

    // Verificar si hay cambios en el número de mensajes
    const newMessageCount = conv.messages.length;
    
    if (!conversation || newMessageCount !== lastMessageCount) {
      console.log('Actualizando conversación:', {
        oldCount: lastMessageCount,
        newCount: newMessageCount,
        conversationId
      });
      
      setConversation(conv);
      setLastMessageCount(newMessageCount);
      
      if (conv) {
        markConversationAsRead(conversationId);
      }
    }
  }, [conversationId, conversation, lastMessageCount, getConversationByIdFromStorage, markConversationAsRead]);

  useEffect(() => {
    // Cargar conversación inicial
    loadConversation();

    // Configurar polling para esta conversación específica
    pollingIntervalRef.current = setInterval(() => {
      loadConversation();
    }, 1500); // Polling cada 1.5 segundos

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loadConversation]);

  useEffect(() => {
    // Scroll al final cuando cambien los mensajes
    if (conversation?.messages?.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [conversation?.messages?.length]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !conversation || isSending) return;

    setIsSending(true);
    const result = sendMessage(conversation.otherParticipant.id, newMessage.trim());

    if (result.success) {
      console.log('Mensaje enviado exitosamente:', result);
      setNewMessage('');
      
      // Forzar actualización inmediata
      setTimeout(() => {
        loadConversation();
      }, 200);
      
      setIsSending(false);
    } else {
      setIsSending(false);
      toast({
        title: 'Error al enviar mensaje',
        description: result.error || 'No se pudo enviar el mensaje',
        variant: 'destructive',
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando conversación...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center mb-6 p-4 border-b dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/messages')}
          className="mr-4"
        >
          <ArrowLeft />
        </Button>
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={conversation.otherParticipant.avatar} />
          <AvatarFallback>{conversation.otherParticipant.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{conversation.otherParticipant.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-lg font-medium">Conversación iniciada</p>
              <p className="text-sm">
                Envía tu primer mensaje a {conversation.otherParticipant.name}
              </p>
            </div>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-end gap-2 max-w-lg',
                msg.senderId === currentUser.id ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl px-4 py-2',
                  msg.senderId === currentUser.id
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                )}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 p-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
            <Send className="w-5 h-5 mr-2" />
            {isSending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationPage;
