import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const QueriesPage = () => {
  const { currentUser, fileToDataUrl } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [careerFilter, setCareerFilter] = useState("all");

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = () => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    setAllPosts(
      allPosts
        .filter((p) => p.type === "query")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const searchMatch =
        searchTerm.trim() === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());

      const careerMatch =
        careerFilter === "all" || post.career === careerFilter;

      return searchMatch && careerMatch;
    });
  }, [allPosts, searchTerm, careerFilter]);

  const handleCreatePost = async (postData) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    let imageDataUrl = null;

    if (postData.imageFile) {
      try {
        imageDataUrl = await fileToDataUrl(postData.imageFile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al procesar la imagen.",
          variant: "destructive",
        });
        return;
      }
    }

    const newPost = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description,
      image: imageDataUrl,
      type: "query",
      author: currentUser.name,
      authorId: currentUser.id,
      career: currentUser.career,
      createdAt: new Date().toISOString(),
      comments: [],
      reactions: 0,
    };

    allPosts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(allPosts));
    loadQueries();
    setShowCreate(false);
    toast({
      title: "Consulta publicada",
      description: "Tu consulta ha sido publicada exitosamente.",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCareerFilter("all");
  };

  const areFiltersActive = searchTerm || careerFilter !== "all";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Consultas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comparte tus dudas y ayuda a otros estudiantes
          </p>
        </div>
        {currentUser?.role === "estudiante" && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nueva Consulta
          </Button>
        )}
      </div>

      <div className="glass-effect rounded-3xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="¿Qué quieres consultar?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={careerFilter} onValueChange={setCareerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por carrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carreras</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Telecomunicaciones">
                Telecomunicaciones
              </SelectItem>
              <SelectItem value="Química Industrial">
                Química Industrial
              </SelectItem>
              <SelectItem value="Mecatrónica">Mecatrónica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {areFiltersActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {areFiltersActive
                ? "No se encontraron consultas con los filtros aplicados."
                : "No hay consultas publicadas aún. ¡Sé el primero en compartir una duda!"}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={loadQueries} />
          ))
        )}
      </div>

      <CreatePostDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreatePost}
        type="query"
      />
    </motion.div>
  );
};

export default QueriesPage;
