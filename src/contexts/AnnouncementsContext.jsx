import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AnnouncementsContext = createContext();

export function useAnnouncements() {
  return useContext(AnnouncementsContext);
}

export function AnnouncementsProvider({ children }) {
  const { currentUser, fileToDataUrl } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadAnnouncements = useCallback(() => {
    if (!currentUser) return;
    const allAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    const relevantAnnouncements = allAnnouncements.filter(ann => {
      if (ann.targetCareers.length === 0) return true; // General announcement
      if (currentUser.role === 'estudiante') {
        return ann.targetCareers.includes(currentUser.career);
      }
      return true; // Non-students see all career-specific announcements
    });

    const userReadStatuses = JSON.parse(localStorage.getItem(`readAnnouncements_${currentUser.id}`) || '[]');
    const unread = relevantAnnouncements.filter(ann => !userReadStatuses.includes(ann.id));
    
    setAnnouncements(relevantAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setUnreadCount(unread.length);
  }, [currentUser]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const addAnnouncement = async (data) => {
    const allAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    let imageDataUrl = null;

    if (data.imageFile) {
      try {
        imageDataUrl = await fileToDataUrl(data.imageFile);
      } catch (error) {
        toast({ title: "Error al procesar imagen", variant: "destructive" });
        return;
      }
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      image: imageDataUrl,
      authorId: currentUser.id,
      authorName: currentUser.name,
      priority: data.priority,
      targetCareers: data.targetCareers,
      createdAt: new Date().toISOString(),
    };

    allAnnouncements.push(newAnnouncement);
    localStorage.setItem('announcements', JSON.stringify(allAnnouncements));
    toast({ title: "Anuncio publicado con éxito" });
    loadAnnouncements();
  };

  const deleteAnnouncement = (id) => {
    let allAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    allAnnouncements = allAnnouncements.filter(ann => ann.id !== id);
    localStorage.setItem('announcements', JSON.stringify(allAnnouncements));
    toast({ title: "Anuncio eliminado" });
    loadAnnouncements();
  };

  const markAsRead = (id) => {
    if (!currentUser) return;
    let userReadStatuses = JSON.parse(localStorage.getItem(`readAnnouncements_${currentUser.id}`) || '[]');
    if (!userReadStatuses.includes(id)) {
      userReadStatuses.push(id);
      localStorage.setItem(`readAnnouncements_${currentUser.id}`, JSON.stringify(userReadStatuses));
      loadAnnouncements();
    }
  };

  const isRead = (id) => {
    if (!currentUser) return false;
    const userReadStatuses = JSON.parse(localStorage.getItem(`readAnnouncements_${currentUser.id}`) || '[]');
    return userReadStatuses.includes(id);
  };

  const value = {
    announcements,
    unreadCount,
    addAnnouncement,
    deleteAnnouncement,
    markAsRead,
    isRead,
    refreshAnnouncements: loadAnnouncements,
  };

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
}