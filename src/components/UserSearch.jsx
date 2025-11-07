import React, { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/contexts/MessagingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const UserSearch = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();
  const { getConversationWithUser, createConversation, getContactableUsers } =
    useMessaging();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const contactableUsers = getContactableUsers();
    const filteredUsers = contactableUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredUsers);
  }, [searchQuery, getContactableUsers]);

  const handleStartConversation = (user) => {
    // Verificar si ya existe una conversación
    const existingConversation = getConversationWithUser(user.id);

    if (existingConversation) {
      // Navegar a la conversación existente
      navigate(`/dashboard/messages/${existingConversation.id}`);
    } else {
      // Crear nueva conversación sin mensaje predeterminado
      const result = createConversation(user.id);

      if (result.success) {
        toast({
          title: "Conversación iniciada",
          description: `Conversación creada con ${user.name}`,
        });

        // Navegar a la nueva conversación
        navigate(`/dashboard/messages/${result.conversationId}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo crear la conversación",
          variant: "destructive",
        });
      }
    }

    // Limpiar búsqueda
    setSearchQuery("");
    setSearchResults([]);

    // Notificar al componente padre si es necesario
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "estudiante":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "profesor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "administrativo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "estudiante":
        return "Estudiante";
      case "profesor":
        return "Profesor";
      case "administrativo":
        return "Administrativo";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={
            currentUser?.role === "estudiante"
              ? "¿A quién quieres contactar...?"
              : "Buscar cualquier usuario..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {searchResults.length} resultado(s) encontrado(s)
            </p>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartConversation(user)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Mensaje
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {searchQuery.trim() !== "" && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>No se encontraron usuarios con ese nombre</p>
          <p className="text-sm mt-1">
            {currentUser?.role === "estudiante"
              ? "Solo puedes buscar profesores, administrativos y administradores"
              : "Puedes buscar cualquier usuario registrado"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
