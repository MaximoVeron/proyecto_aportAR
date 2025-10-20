import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertTriangle, Trash2, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CreateAnnouncementDialog = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [targetCareers, setTargetCareers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = () => {
    if (!title || !content) {
      toast({ title: "Error", description: "El título y el contenido son obligatorios.", variant: "destructive" });
      return;
    }
    onSubmit({ title, content, priority, targetCareers, imageFile });
    onClose();
    setTitle('');
    setContent('');
    setPriority('normal');
    setTargetCareers([]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const careerOptions = ["Software", "Telecomunicaciones", "Química Industrial", "Mecatrónica"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crear Anuncio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Carreras (opcional)</Label>
              <Select onValueChange={val => setTargetCareers(val === 'all' ? [] : [val])}>
                <SelectTrigger><SelectValue placeholder="Para todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Para todos</SelectItem>
                  {careerOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Imagen (opcional)</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 rounded-md max-h-40 object-contain" />}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Publicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AnnouncementCard = ({ announcement, onRead, isRead, canDelete, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleRead = () => {
    onRead(announcement.id);
    setShowDetail(true);
  };

  const isUrgent = announcement.priority === 'urgent';
  const readStatus = isRead(announcement.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect rounded-2xl p-5 flex items-center justify-between gap-4 transition-all ${isUrgent ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'} ${!readStatus ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
      >
        <div className="flex items-center gap-4">
          {isUrgent && <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />}
          <div>
            <h3 className={`font-bold ${!readStatus ? 'text-lg' : ''}`}>{announcement.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Por {announcement.authorName} • {new Date(announcement.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRead}>
            <Eye className="w-4 h-4 mr-2" />
            Ver
          </Button>
          {canDelete && (
            <Button variant="destructive" size="icon" onClick={() => onDelete(announcement.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isUrgent && <AlertTriangle className="w-6 h-6 text-red-500" />}
              {announcement.title}
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              Publicado por {announcement.authorName} el {new Date(announcement.createdAt).toLocaleString('es-AR')}
            </p>
          </DialogHeader>
          {announcement.image && <img src={announcement.image} alt={announcement.title} className="my-4 rounded-lg max-h-80 w-full object-contain" />}
          <div className="py-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{announcement.content}</div>
          <DialogFooter>
            <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AnnouncementsPage = () => {
  const { currentUser } = useAuth();
  const { announcements, addAnnouncement, deleteAnnouncement, markAsRead, isRead } = useAnnouncements();
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ priority: 'all', read: 'all' });

  const canCreate = ['admin', 'profesor', 'administrativo'].includes(currentUser?.role);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(ann => {
      const priorityMatch = filters.priority === 'all' || ann.priority === filters.priority;
      const readMatch = filters.read === 'all' || (filters.read === 'read' && isRead(ann.id)) || (filters.read === 'unread' && !isRead(ann.id));
      return priorityMatch && readMatch;
    });
  }, [announcements, filters, isRead]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Centro de Anuncios</h1>
        {canCreate && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Anuncio
          </Button>
        )}
      </div>

      <div className="glass-effect rounded-2xl p-4 mb-6 flex gap-4">
        <Select value={filters.priority} onValueChange={v => setFilters(f => ({...f, priority: v}))}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Prioridad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda prioridad</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.read} onValueChange={v => setFilters(f => ({...f, read: v}))}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="read">Leídos</SelectItem>
            <SelectItem value="unread">No leídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map(ann => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onRead={markAsRead}
              isRead={isRead}
              canDelete={canCreate}
              onDelete={deleteAnnouncement}
            />
          ))
        ) : (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No hay anuncios que coincidan con los filtros.</p>
          </div>
        )}
      </div>

      {canCreate && (
        <CreateAnnouncementDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={addAnnouncement}
        />
      )}
    </motion.div>
  );
};

export default AnnouncementsPage;