
    import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getConversationById, sendMessage, markConversationAsRead } = useMessaging();
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const conv = getConversationById(conversationId);
    setConversation(conv);
    if (conv) {
      markConversationAsRead(conversationId);
    }
  }, [conversationId, getConversationById, markConversationAsRead]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !conversation) return;
    
    const result = sendMessage(conversation.otherParticipant.id, newMessage.trim());
    
    if (result.success) {
      setNewMessage('');
    } else {
      toast({
        title: "Error al enviar mensaje",
        description: result.error || "No se pudo enviar el mensaje",
        variant: "destructive"
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      <div className="flex items-center mb-6 p-4 border-b dark:border-gray-700">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/messages')} className="mr-4">
          <ArrowLeft />
        </Button>
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={conversation.otherParticipant.avatar} />
          <AvatarFallback>{conversation.otherParticipant.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{conversation.otherParticipant.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {conversation.messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 max-w-lg",
              msg.senderId === currentUser.id ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-2",
                msg.senderId === currentUser.id
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
              )}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 p-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-5 h-5 mr-2" /> Enviar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationPage;
  