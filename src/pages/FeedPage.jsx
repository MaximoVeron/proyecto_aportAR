import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const FeedPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    career: "all",
    status: "all",
  });

  const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    setAllPosts(
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const searchMatch =
        searchTerm.trim() === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());

      const typeMatch = filters.type === "all" || post.type === filters.type;
      const careerMatch =
        filters.career === "all" || post.career === filters.career;
      const statusMatch =
        filters.status === "all" || post.status === filters.status;

      if (post.type === "problem") {
        return searchMatch && typeMatch && statusMatch;
      }

      return searchMatch && typeMatch && careerMatch;
    });
  }, [allPosts, searchTerm, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: value };

      // Si se cambia el tipo y no es "problem", resetear el estado
      if (filterName === "type" && value !== "problem") {
        newFilters.status = "all";
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ type: "all", career: "all", status: "all" });
  };

  const areFiltersActive =
    searchTerm ||
    filters.type !== "all" ||
    filters.career !== "all" ||
    filters.status !== "all";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold gradient-text mb-8">Inicio</h1>

      <div className="glass-effect rounded-3xl p-6 mb-8 space-y-4">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            filters.type === "problem" ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-4`}
        >
          <Input
            placeholder="Buscar por palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de publicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="project">Proyectos</SelectItem>
              <SelectItem value="suggestion">Sugerencias</SelectItem>
              <SelectItem value="problem">Problemáticas</SelectItem>
              <SelectItem value="query">Consultas</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.career}
            onValueChange={(value) => handleFilterChange("career", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Carrera" />
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

          {/* Filtro de estado - Solo visible cuando el tipo es "problem" */}
          {filters.type === "problem" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>
        {areFiltersActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))
        ) : (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron publicaciones con los filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeedPage;
