import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Heart, Flag, Trash2, CheckCircle, Award } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ReportDialog from '@/components/ReportDialog';
import CommentThread from '@/components/CommentThread';

const PostCard = ({ post, onUpdate }) => {
  const { currentUser, getUserAvatar } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({ postId: null, commentId: null, authorId: null });
  const [liked, setLiked] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState(null);

  const isProblem = post.type === 'problem';

  useEffect(() => {
    if (!isProblem) {
      setAuthorAvatar(getUserAvatar(post.authorId));
    }
  }, [post.authorId, getUserAvatar, isProblem]);

  // Verificar si el usuario actual ya dio like a esta publicación
  useEffect(() => {
    if (currentUser && post.id) {
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      const hasLiked = userLikes[currentUser.id]?.includes(post.id) || false;
      setLiked(hasLiked);
    }
  }, [currentUser, post.id]);

  const handleComment = () => {
    if (!comment.trim()) return;

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1) {
      if (!posts[postIndex].comments) posts[postIndex].comments = [];
      posts[postIndex].comments.push({
        id: Date.now().toString(),
        author: currentUser.name,
        authorId: currentUser.id,
        text: comment,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('posts', JSON.stringify(posts));
      setComment('');
      toast({ title: isProblem ? 'Propuesta enviada' : 'Comentario agregado' });
      onUpdate();
    }
  };

  const handleLike = () => {
    if (!currentUser) return;

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    const postIndex = posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1) {
      // Inicializar array de likes del usuario si no existe
      if (!userLikes[currentUser.id]) {
        userLikes[currentUser.id] = [];
      }

      const userLikesArray = userLikes[currentUser.id];
      const hasLiked = userLikesArray.includes(post.id);

      if (hasLiked) {
        // Quitar like
        posts[postIndex].reactions = Math.max(0, posts[postIndex].reactions - 1);
        userLikes[currentUser.id] = userLikesArray.filter((id) => id !== post.id);
        setLiked(false);
      } else {
        // Agregar like
        posts[postIndex].reactions += 1;
        userLikes[currentUser.id].push(post.id);
        setLiked(true);
      }

      localStorage.setItem('posts', JSON.stringify(posts));
      localStorage.setItem('userLikes', JSON.stringify(userLikes));
      onUpdate();
    }
  };

  const handleDelete = () => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPosts = posts.filter((p) => p.id !== post.id);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    toast({ title: 'Publicación eliminada' });
    onUpdate();
  };

  const getCommenterAvatar = (authorId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u) => u.id === authorId)?.avatar;
  };

  const handleSelectWinner = (commentId) => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex((p) => p.id === post.id);

    if (postIndex !== -1) {
      posts[postIndex].winningProposalId = commentId;
      posts[postIndex].status = 'Completado';
      localStorage.setItem('posts', JSON.stringify(posts));
      toast({
        title: '¡Solución seleccionada!',
        description: 'La problemática ha sido marcada como completada.',
      });
      onUpdate();
    }
  };

  const handleReportPost = () => {
    setReportData({ postId: post.id, commentId: null, authorId: post.authorId });
    setShowReport(true);
  };

  const handleReportComment = (commentId) => {
    const comment = post.comments.find((c) => c.id === commentId);
    if (comment) {
      setReportData({ postId: post.id, commentId: comment.id, authorId: comment.authorId });
      setShowReport(true);
    }
  };

  const canDelete =
    currentUser?.role === 'admin' || (!isProblem && currentUser?.id === post.authorId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-3xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        {isProblem ? (
          <div>
            <p className="font-bold text-lg gradient-text">Problemática - {post.problemNumber}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publicado el {new Date(post.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={authorAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
                {post.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{post.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {post.career && `${post.career} • `}
                {new Date(post.createdAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2 items-center">
          {isProblem && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                post.status === 'Completado'
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
              }`}
            >
              {post.status === 'Completado' && <CheckCircle className="w-4 h-4" />}
              {post.status}
            </span>
          )}
          {canDelete && (
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-2xl mb-4"
        />
      )}

      <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {post.description}
      </p>

      <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          {post.reactions}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="w-5 h-5 mr-2" />
          {post.comments?.length || 0} {isProblem ? 'Propuestas' : 'Comentarios'}
        </Button>
        {!isProblem && (
          <Button variant="ghost" size="sm" onClick={handleReportPost}>
            <Flag className="w-5 h-5 mr-2" />
            Reportar
          </Button>
        )}
      </div>

      {showComments &&
        (isProblem ? (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu propuesta de solución..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button onClick={handleComment}>Enviar</Button>
            </div>
            <div className="space-y-3">
              {post.comments?.map((c) => {
                const isWinner = post.winningProposalId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`glass-effect rounded-xl p-4 flex gap-3 relative ${
                      isWinner ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    {isWinner && (
                      <div className="absolute -top-3 -left-3 bg-green-500 text-white rounded-full p-1">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={getCommenterAvatar(c.authorId)} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                        {c.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{c.author}</p>
                      <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(c.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    {currentUser?.role === 'admin' && !post.winningProposalId && (
                      <Button size="sm" onClick={() => handleSelectWinner(c.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Elegir Ganadora
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <CommentThread post={post} onUpdate={onUpdate} onReportComment={handleReportComment} />
        ))}

      <ReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
        reportData={reportData}
      />
    </motion.div>
  );
};

export default PostCard;
