import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

const CreatePostDialog = ({ open, onClose, onSubmit, type }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          toast({ title: "Error", description: "El archivo es muy grande (máx 5MB)", variant: "destructive" });
          return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          toast({ title: "Error", description: "Formato no permitido (JPG, PNG, GIF)", variant: "destructive" });
          return;
      }
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }
    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imageFile: null });
    setImagePreview(null);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const titles = {
    project: 'Nuevo Proyecto',
    suggestion: 'Nueva Sugerencia',
    problem: 'Nueva Problemática'
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título de tu publicación"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu publicación..."
              rows={5}
              required
            />
          </div>
          <div>
            <Label htmlFor="image-upload">Imagen (opcional, máx 5MB)</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="file:text-white file:bg-green-600 hover:file:bg-green-700 file:rounded-lg file:px-3 file:py-2 file:border-0"
            />
          </div>
          {imagePreview && (
            <div className="relative">
              <img src={imagePreview} alt="Previsualización" className="w-full max-h-60 object-contain rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                onClick={() => {
                  setImagePreview(null);
                  setFormData({ ...formData, imageFile: null });
                }}
              >
                <X className="h-4 w-4"/>
              </Button>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Publicar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;