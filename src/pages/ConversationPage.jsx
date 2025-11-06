import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft, MessageSquare, Paperclip } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MessageFile from '@/components/MessageFile';
import MessageBubble from '@/components/MessageBubble';
import FileUpload from '@/components/FileUpload';

const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getConversationByIdFromStorage, sendMessage, sendFileMessage, markConversationAsRead } =
    useMessaging();
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [showFileUpload, setShowFileUpload] = useState(false);
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
        conversationId,
      });

      setConversation(conv);
      setLastMessageCount(newMessageCount);

      if (conv) {
        markConversationAsRead(conversationId);
      }
    }
  }, [
    conversationId,
    conversation,
    lastMessageCount,
    getConversationByIdFromStorage,
    markConversationAsRead,
  ]);

  // Función para forzar actualización inmediata (para ediciones)
  const forceUpdateConversation = useCallback(() => {
    if (!conversationId) return;

    const conv = getConversationByIdFromStorage(conversationId);

    if (conv) {
      console.log('Forzando actualización de conversación por edición/eliminación');
      setConversation(conv);
      setLastMessageCount(conv.messages.length);
      markConversationAsRead(conversationId);
    }
  }, [conversationId, getConversationByIdFromStorage, markConversationAsRead]);

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

  const handleFileSelect = async (file, caption) => {
    if (!conversation || isSending) return;

    setIsSending(true);
    setShowFileUpload(false);

    const result = await sendFileMessage(conversation.otherParticipant.id, file, caption);

    if (result.success) {
      console.log('Archivo enviado exitosamente:', result);

      // Forzar actualización inmediata
      setTimeout(() => {
        loadConversation();
      }, 200);

      setIsSending(false);
    } else {
      setIsSending(false);
      toast({
        title: 'Error al enviar archivo',
        description: result.error || 'No se pudo enviar el archivo',
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
            <MessageBubble
              key={`${msg.id}-${msg.editedAt || msg.timestamp}`}
              message={msg}
              conversationId={conversationId}
              onMessageUpdate={forceUpdateConversation}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 p-4 border-t dark:border-gray-700">
        {showFileUpload ? (
          <div className="mb-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              onCancel={() => setShowFileUpload(false)}
              disabled={isSending}
            />
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFileUpload(!showFileUpload)}
            disabled={isSending}
            className="flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex items-end gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 min-h-[40px] resize-none"
              disabled={isSending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationPage;
