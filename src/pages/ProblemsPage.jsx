import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProblemsPage = () => {
  const { currentUser, fileToDataUrl } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const canCreate = currentUser?.role === 'profesor' || currentUser?.role === 'admin';

  const loadProblems = () => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(allPosts.filter(p => p.type === 'problem').sort((a, b) => b.problemNumber - a.problemNumber));
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleCreatePost = async (postData) => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const problemPosts = allPosts.filter(p => p.type === 'problem');
    let imageDataUrl = null;

    if (postData.imageFile) {
        try {
            imageDataUrl = await fileToDataUrl(postData.imageFile);
        } catch (error) {
            toast({ title: "Error", description: "Error al procesar la imagen.", variant: "destructive" });
            return;
        }
    }

    const newPost = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description,
      image: imageDataUrl,
      type: 'problem',
      author: currentUser.name,
      authorId: currentUser.id,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: 0,
      problemNumber: (problemPosts.length || 0) + 1,
      winningProposalId: null,
    };
    allPosts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(allPosts));
    loadProblems();
    setShowCreate(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Problemáticas</h1>
        {canCreate && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nueva Problemática
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No hay problemáticas publicadas aún</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadProblems} />
          ))
        )}
      </div>

      <CreatePostDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreatePost}
        type="problem"
      />
    </motion.div>
  );
};

export default ProblemsPage;