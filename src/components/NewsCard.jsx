import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import EditNewsDialog from '@/components/EditNewsDialog';

const NewsCard = ({ newsItem, onUpdate, canEdit }) => {
  const { currentUser, getUserAvatar } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState(null);

  useEffect(() => {
    setAuthorAvatar(getUserAvatar(newsItem.authorId));
  }, [newsItem.authorId, getUserAvatar]);

  const handleDelete = () => {
    const news = JSON.parse(localStorage.getItem('news') || '[]');
    const newNews = news.filter((n) => n.id !== newsItem.id);
    localStorage.setItem('news', JSON.stringify(newNews));
    toast({ title: 'Noticia eliminada' });
    onUpdate();
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'profesor':
        return 'Profesor';
      case 'administrativo':
        return 'Administrativo';
      default:
        return role;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-3xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
              {newsItem.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{newsItem.author}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getRoleName(newsItem.authorRole)}
              {newsItem.career && ` • ${newsItem.career}`}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(newsItem.createdAt).toLocaleDateString('es-AR')}</span>
              <span className="mx-1">•</span>
              <span>
                {new Date(newsItem.createdAt).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {canEdit && (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setShowEditDialog(true)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {newsItem.image && (
        <img
          src={newsItem.image}
          alt={newsItem.title}
          className="w-full max-h-[400px] object-cover rounded-2xl mb-4"
        />
      )}

      <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">{newsItem.title}</h3>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {newsItem.description}
        </p>
      </div>

      {canEdit && (
        <EditNewsDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          newsItem={newsItem}
          onNewsUpdated={onUpdate}
        />
      )}
    </motion.div>
  );
};

export default NewsCard;
