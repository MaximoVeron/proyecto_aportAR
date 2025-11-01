import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Clock 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import MessageFile from '@/components/MessageFile';

const MessageBubble = ({ message, conversationId, onMessageUpdate }) => {
  const { currentUser } = useAuth();
  const { editMessage, deleteMessage } = useMessaging();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef(null);

  const isOwnMessage = message.senderId === currentUser.id;
  const isFileMessage = message.type === 'file';

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Posicionar el cursor al final del texto
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast({
        title: 'Error',
        description: 'El mensaje no puede estar vacío',
        variant: 'destructive',
      });
      return;
    }

    const result = editMessage(conversationId, message.id, editContent.trim());
    
    if (result.success) {
      setIsEditing(false);
      onMessageUpdate?.();
      toast({
        title: 'Mensaje editado',
        description: 'El mensaje se ha actualizado correctamente',
      });
    } else {
      toast({
        title: 'Error al editar',
        description: result.error || 'No se pudo editar el mensaje',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    const result = deleteMessage(conversationId, message.id);
    
    if (result.success) {
      onMessageUpdate?.();
      toast({
        title: 'Mensaje eliminado',
        description: 'El mensaje se ha eliminado correctamente',
      });
    } else {
      toast({
        title: 'Error al eliminar',
        description: result.error || 'No se pudo eliminar el mensaje',
        variant: 'destructive',
      });
    }
    setIsMenuOpen(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex items-start gap-2 max-w-lg group',
        isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <div
        className={cn(
          'relative rounded-2xl px-4 py-2',
          isOwnMessage
            ? 'bg-green-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        )}
      >
        {isEditing && !isFileMessage ? (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={cn(
                'min-h-[60px] resize-none border-0 p-0 text-sm',
                isOwnMessage
                  ? 'bg-transparent text-white placeholder:text-green-100'
                  : 'bg-transparent text-gray-800 dark:text-gray-200 placeholder:text-gray-500'
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
            <div className="flex justify-end gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className={cn(
                  'h-7 px-2 text-xs',
                  isOwnMessage
                    ? 'text-green-100 hover:bg-green-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveEdit}
                className={cn(
                  'h-7 px-2 text-xs',
                  isOwnMessage
                    ? 'text-green-100 hover:bg-green-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {isFileMessage && message.fileData ? (
              <div className="space-y-2">
                <MessageFile fileData={message.fileData} />
                {message.content && <p className="text-sm">{message.content}</p>}
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1 text-xs opacity-70">
                <span>{formatTime(message.timestamp)}</span>
                {message.isEdited && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    editado
                  </span>
                )}
              </div>
              
              {isOwnMessage && (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
                        isOwnMessage
                          ? 'text-green-100 hover:bg-green-700'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    {!isFileMessage && (
                      <DropdownMenuItem onClick={handleEdit} className="text-sm">
                        <Edit3 className="w-3 h-3 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={handleDelete} 
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;