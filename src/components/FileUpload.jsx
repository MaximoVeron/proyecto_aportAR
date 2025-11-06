import React, { useRef, useState } from 'react';
import { Paperclip, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const FileUpload = ({ onFileSelect, onCancel, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El archivo no puede ser mayor a 10MB',
        variant: 'destructive',
      });
      return;
    }

    // Validar tipos permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no permitido',
        description: 'Solo se permiten imágenes, PDF y documentos de oficina',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleSend = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, caption);
      setSelectedFile(null);
      setCaption('');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setCaption('');
    if (onCancel) onCancel();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(selectedFile.size)}
            </p>
            {selectedFile.type.startsWith('image/') && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-w-32 max-h-32 rounded object-cover"
                />
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={disabled}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption" className="text-sm">
            Descripción (opcional)
          </Label>
          <Input
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Agrega una descripción..."
            disabled={disabled}
          />
        </div>

        <div className="flex gap-2 mt-3">
          <Button onClick={handleSend} disabled={disabled} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Enviar archivo
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={disabled}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        isDragging
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
        disabled={disabled}
      />

      <div className="space-y-2">
        <Paperclip className="mx-auto h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Adjuntar archivo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Arrastra un archivo aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Máximo 10MB • Imágenes, PDF, documentos
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Seleccionar archivo
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
