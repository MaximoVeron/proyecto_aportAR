import React from 'react';
import { Download, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessageFile = ({ fileData, className = '' }) => {
  if (!fileData) return null;

  const { name, size, type, data, isImage } = fileData;

  // Formatear tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Descargar archivo
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = data;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = () => {
    if (isImage) return <Image className="h-5 w-5" />;
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('document') || type.includes('word'))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (type.includes('sheet') || type.includes('excel'))
      return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5" />;
  };

  if (isImage) {
    return (
      <div className={`max-w-xs ${className}`}>
        <div className="relative group">
          <img
            src={data}
            alt={name}
            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(data, '_blank')}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile();
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(size)}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 max-w-xs ${className}`}
    >
      <div className="flex-shrink-0">{getFileIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(size)}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={downloadFile} className="flex-shrink-0">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageFile;
