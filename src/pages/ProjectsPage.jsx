import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProjectsPage = () => {
  const { currentUser, fileToDataUrl } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = () => {
      const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      setPosts(allPosts.filter(p => p.type === 'project').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  const handleCreatePost = async (postData) => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
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
      type: 'project',
      author: currentUser.name,
      authorId: currentUser.id,
      career: currentUser.career,
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: 0
    };
    allPosts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(allPosts));
    loadProjects();
    setShowCreate(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Proyectos</h1>
        {currentUser?.role === 'estudiante' && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No hay proyectos publicados aún</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadProjects} />
          ))
        )}
      </div>

      <CreatePostDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreatePost}
        type="project"
      />
    </motion.div>
  );
};

export default ProjectsPage;