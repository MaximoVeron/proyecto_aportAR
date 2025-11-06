import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    avatarFile: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.avatar || null
  );
  const avatarInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setEditing(false);
      setFormData({ ...formData, avatarFile: null });
    }
  };

  const handleAvatarClick = () => {
    if (editing) {
      avatarInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen es muy grande (máx 5MB)",
          variant: "destructive",
        });
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast({
          title: "Error",
          description: "Formato de imagen no válido (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }

      setFormData({ ...formData, avatarFile: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: currentUser?.name,
      bio: currentUser?.bio,
      avatarFile: null,
    });
    setAvatarPreview(currentUser?.avatar);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Mi Perfil</h1>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="glass-effect rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <div className="relative mx-auto md:mx-0">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-green-400 to-green-600 text-white">
                {currentUser?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="flex-1 w-full">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-2">{currentUser?.name}</h2>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-1">
                  {currentUser?.role}
                </p>
                {currentUser?.career && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentUser.career}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {currentUser?.bio || "Sin biografía"}
                </p>
                <Button onClick={() => setEditing(true)}>Editar Perfil</Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentUser?.email}
            </p>
          </div>
          <div className="glass-effect rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Miembro desde</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date(currentUser?.createdAt).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
