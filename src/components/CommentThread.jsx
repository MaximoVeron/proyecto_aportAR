import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare, CornerDownRight, Flag, Trash2 } from 'lucide-react';

const MAX_DEPTH = 3;

const Comment = ({ comment, onReply, onDelete, onReport, level }) => {
  const { currentUser, getUserAvatar } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const commenterAvatar = getUserAvatar(comment.authorId);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText, comment.authorId);
    setReplyText('');
    setReplying(false);
  };

  const canDelete = currentUser?.role === 'admin' || currentUser?.id === comment.authorId;

  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={commenterAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
            {comment.author.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="glass-effect rounded-xl p-3">
            <p className="font-semibold text-sm">{comment.author}</p>
            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1 pl-2">
            <span>{new Date(comment.createdAt).toLocaleDateString('es-AR')}</span>
            {level < MAX_DEPTH && (
              <>
                <span>•</span>
                <button onClick={() => setReplying(!replying)} className="font-semibold hover:underline">Responder</button>
              </>
            )}
            <span>•</span>
            <button onClick={() => onReport(comment.id)} className="font-semibold hover:underline">Reportar</button>
            {canDelete && (
              <>
                <span>•</span>
                <button onClick={() => onDelete(comment.id)} className="font-semibold text-red-500 hover:underline">Eliminar</button>
              </>
            )}
          </div>
        </div>
      </div>

      {replying && (
        <div className="pl-11 mt-2 flex gap-2">
          <Input
            placeholder={`Respondiendo a ${comment.author}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
            autoFocus
          />
          <Button size="sm" onClick={handleReply}>Enviar</Button>
        </div>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="pl-6 mt-3 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
          {comment.children.map(child => (
            <Comment key={child.id} comment={child} onReply={onReply} onDelete={onDelete} onReport={onReport} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentThread = ({ post, onUpdate, onReportComment }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [comment, setComment] = useState('');

  const buildCommentTree = (comments) => {
    const commentMap = {};
    comments.forEach(c => {
      commentMap[c.id] = { ...c, children: [] };
    });

    const tree = [];
    comments.forEach(c => {
      if (c.parentId && commentMap[c.parentId]) {
        commentMap[c.parentId].children.push(commentMap[c.id]);
      } else {
        tree.push(commentMap[c.id]);
      }
    });
    return tree;
  };

  const commentTree = buildCommentTree(post.comments || []);

  const handleComment = (parentId = null, text, parentAuthorId = null) => {
    if (!text.trim()) return;

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === post.id);

    if (postIndex !== -1) {
      const newComment = {
        id: Date.now().toString(),
        author: currentUser.name,
        authorId: currentUser.id,
        career: currentUser.career,
        text,
        createdAt: new Date().toISOString(),
        parentId,
      };

      if (!posts[postIndex].comments) {
        posts[postIndex].comments = [];
      }
      posts[postIndex].comments.push(newComment);
      localStorage.setItem('posts', JSON.stringify(posts));
      
      if (parentId) {
        if (parentAuthorId && parentAuthorId !== currentUser.id) {
          addNotification(parentAuthorId, `${currentUser.name} respondió a tu comentario en "${post.title}"`, `/dashboard/`);
        }
      } else {
        if (post.authorId !== currentUser.id) {
          addNotification(post.authorId, `${currentUser.name} comentó en tu publicación "${post.title}"`, `/dashboard/`);
        }
      }

      toast({ title: "Comentario agregado" });
      onUpdate();
    }
  };
  
  const handleDeleteComment = (commentId) => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === post.id);

    if (postIndex !== -1) {
      const comments = posts[postIndex].comments;
      const commentsToDelete = new Set([commentId]);
      let changed = true;
      while(changed) {
        changed = false;
        const currentSize = commentsToDelete.size;
        comments.forEach(c => {
          if (c.parentId && commentsToDelete.has(c.parentId)) {
            commentsToDelete.add(c.id);
          }
        });
        if (commentsToDelete.size > currentSize) changed = true;
      }
      
      posts[postIndex].comments = comments.filter(c => !commentsToDelete.has(c.id));
      localStorage.setItem('posts', JSON.stringify(posts));
      toast({ title: "Comentario eliminado" });
      onUpdate();
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex gap-2">
        <Input
          placeholder="Escribe un comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleComment(null, comment);
              setComment('');
            }
          }}
        />
        <Button onClick={() => { handleComment(null, comment); setComment(''); }}>Enviar</Button>
      </div>

      <div className="space-y-4">
        {commentTree.map(c => (
          <Comment key={c.id} comment={c} onReply={handleComment} onDelete={handleDeleteComment} onReport={onReportComment} level={1} />
        ))}
      </div>
    </div>
  );
};

export default CommentThread;