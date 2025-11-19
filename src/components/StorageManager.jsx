import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2, Download, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/**
 * Componente de emergencia para resetear el localStorage
 *
 * Para usarlo, agrégalo temporalmente a tu App.jsx o Dashboard:
 *
 * import StorageManager from "@/components/StorageManager";
 *
 * // Dentro del componente, antes del return:
 * <StorageManager />
 */
export default function StorageManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [storageData, setStorageData] = useState(null);

  const loadStorageData = () => {
    const data = {
      users: localStorage.getItem("users"),
      quarters: localStorage.getItem("quarters"),
      announcements: localStorage.getItem("announcements"),
      conversations: localStorage.getItem("conversations"),
      currentUser: localStorage.getItem("currentUser"),
    };
    setStorageData(data);
  };

  const clearAll = () => {
    if (
      window.confirm("⚠️ ¿Estás seguro? Se borrarán TODOS los datos locales")
    ) {
      localStorage.clear();
      toast({
        title: "✓ Storage limpiado",
        description: "Todos los datos fueron eliminados. Recarga la página.",
      });
      setIsOpen(false);
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const clearQuarters = () => {
    localStorage.removeItem("quarters");
    toast({
      title: "✓ Asistencias eliminadas",
      description: "Los cuatrimestres fueron eliminados.",
    });
    loadStorageData();
  };

  const clearUsers = () => {
    localStorage.removeItem("users");
    toast({
      title: "✓ Usuarios eliminados",
      description: "Los usuarios fueron eliminados.",
    });
    loadStorageData();
  };

  const exportData = () => {
    const backup = {
      users: localStorage.getItem("users"),
      quarters: localStorage.getItem("quarters"),
      announcements: localStorage.getItem("announcements"),
      conversations: localStorage.getItem("conversations"),
      currentUser: localStorage.getItem("currentUser"),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aportAR-backup-${Date.now()}.json`;
    a.click();

    toast({
      title: "✓ Backup creado",
      description: "Se descargó el archivo de respaldo.",
    });
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        Object.keys(backup).forEach((key) => {
          if (key !== "timestamp" && backup[key]) {
            localStorage.setItem(key, backup[key]);
          }
        });
        toast({
          title: "✓ Datos restaurados",
          description: "El backup se importó correctamente. Recarga la página.",
        });
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast({
          title: "Error",
          description: "El archivo no es válido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
          onClick={loadStorageData}
        >
          <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
          Emergencia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Gestión de Storage (Emergencia)
          </DialogTitle>
          <DialogDescription>
            Herramientas para resetear o hacer backup del localStorage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del storage */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Estado del Storage:</h3>
            <div className="space-y-1 text-sm">
              <p>
                Usuarios:{" "}
                {storageData?.users ? JSON.parse(storageData.users).length : 0}{" "}
                registrados
              </p>
              <p>
                Cuatrimestres:{" "}
                {storageData?.quarters
                  ? JSON.parse(storageData.quarters).length
                  : 0}{" "}
                creados
              </p>
              <p>
                Sesión: {storageData?.currentUser ? "Activa" : "No iniciada"}
              </p>
            </div>
          </div>

          {/* Acciones de backup */}
          <div className="space-y-2">
            <h3 className="font-semibold">Backup y Restauración:</h3>
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Exportar Backup
              </Button>
              <Button variant="outline" className="flex-1 relative">
                <Upload className="w-4 h-4 mr-2" />
                Importar Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
            </div>
          </div>

          {/* Acciones de limpieza */}
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600 dark:text-red-400">
              Limpiar datos:
            </h3>
            <div className="space-y-2">
              <Button
                onClick={clearQuarters}
                variant="outline"
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar solo Asistencias/Cuatrimestres
              </Button>
              <Button
                onClick={clearUsers}
                variant="outline"
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar solo Usuarios
              </Button>
              <Button
                onClick={clearAll}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar TODO el Storage
              </Button>
            </div>
          </div>

          {/* Advertencia */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Advertencia:</strong> Estas acciones no se pueden
              deshacer. Crea un backup antes de eliminar datos importantes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
