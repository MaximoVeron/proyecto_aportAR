import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    
    if (users.find(u => u.email === userData.email) || pendingUsers.find(u => u.email === userData.email)) {
      toast({
        title: "Error",
        description: "Este email ya está registrado",
        variant: "destructive"
      });
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    pendingUsers.push(newUser);
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));

    toast({
      title: "¡Registro exitoso!",
      description: "Espere la confirmación de un administrador e intente acceder"
    });
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      toast({
        title: "Error",
        description: "Credenciales incorrectas o usuario no aprobado",
        variant: "destructive"
      });
      return false;
    }

    if (user.blocked) {
      toast({
        title: "Acceso bloqueado",
        description: "Tu cuenta ha sido bloqueada por un administrador",
        variant: "destructive"
      });
      return false;
    }

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    toast({
      title: "¡Bienvenido!",
      description: `Hola ${user.name}`
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Sesión cerrada",
      description: "Hasta pronto"
    });
  };

  const updateProfile = async (updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], name: updates.name, bio: updates.bio };
      
      if (updates.avatarFile) {
        if (updates.avatarFile.size > 5 * 1024 * 1024) {
            toast({ title: "Error", description: "La imagen es muy grande (máx 5MB)", variant: "destructive" });
            return false;
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(updates.avatarFile.type)) {
            toast({ title: "Error", description: "Formato de imagen no válido (JPG, PNG, GIF)", variant: "destructive" });
            return false;
        }
        try {
            const avatarDataUrl = await fileToDataUrl(updates.avatarFile);
            updatedUser.avatar = avatarDataUrl;
        } catch (error) {
            toast({ title: "Error al procesar imagen", variant: "destructive"});
            return false;
        }
      }

      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios se guardaron correctamente"
      });
      return true;
    }
    return false;
  };

  const getUserAvatar = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    return user?.avatar;
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateProfile,
    getUserAvatar,
    fileToDataUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}