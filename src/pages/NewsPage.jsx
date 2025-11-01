import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateNewsDialog from '@/components/CreateNewsDialog';
import NewsCard from '@/components/NewsCard';

const NewsPage = () => {
  const { currentUser } = useAuth();
  const [news, setNews] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Verificar si el usuario puede crear noticias
  const canCreateNews = currentUser?.role === 'admin' || 
                       currentUser?.role === 'profesor' || 
                       currentUser?.role === 'administrativo';

  const loadNews = () => {
    const storedNews = JSON.parse(localStorage.getItem('news') || '[]');
    setNews(storedNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleNewsCreated = () => {
    loadNews();
    setShowCreateDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Noticias y Eventos</h1>
        {canCreateNews && (
          <Button 
            onClick={() => setShowCreateDialog(true)} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Noticia
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {news.length > 0 ? (
          news.map(newsItem => (
            <NewsCard 
              key={newsItem.id} 
              newsItem={newsItem} 
              onUpdate={loadNews}
              canEdit={canCreateNews && (currentUser?.role === 'admin' || currentUser?.id === newsItem.authorId)}
            />
          ))
        ) : (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No hay noticias disponibles aún.
            </p>
            {canCreateNews ? (
              <p className="text-gray-500 dark:text-gray-500">
                ¡Sé el primero en publicar una noticia o evento!
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-500">
                Las noticias y eventos aparecerán aquí cuando sean publicadas por el personal administrativo.
              </p>
            )}
          </div>
        )}
      </div>

      {canCreateNews && (
        <CreateNewsDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onNewsCreated={handleNewsCreated}
        />
      )}
    </motion.div>
  );
};

export default NewsPage;