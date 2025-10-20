
    import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMessaging } from '@/contexts/MessagingContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquareDashed } from 'lucide-react';

const MessagesPage = () => {
  const { conversations } = useMessaging();
  const navigate = useNavigate();

  const getUnreadCountForConversation = (conv) => {
    return conv.messages.filter(m => !m.read).length;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold gradient-text mb-8">Mensajes</h1>
      
      <div className="glass-effect rounded-2xl p-6">
        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map(conv => {
              const unreadCount = getUnreadCountForConversation(conv);
              return (
                <div
                  key={conv.id}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800/50 ${unreadCount > 0 ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                  onClick={() => navigate(`/dashboard/messages/${conv.id}`)}
                >
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={conv.otherParticipant.avatar} alt={conv.otherParticipant.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
                      {conv.otherParticipant.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-800 dark:text-gray-100">{conv.otherParticipant.name}</p>
                      {conv.lastMessage && <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(conv.lastMessage.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-4">
                        {conv.lastMessage ? conv.lastMessage.content : 'No hay mensajes'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageSquareDashed className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No tenés conversaciones</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Iniciá una conversación desde el perfil de un usuario.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessagesPage;
  