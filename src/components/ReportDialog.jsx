import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ReportDialog = ({ open, onClose, reportData }) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Debes indicar el motivo del reporte",
        variant: "destructive"
      });
      return;
    }

    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    reports.push({
      id: Date.now().toString(),
      ...reportData,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('reports', JSON.stringify(reports));

    toast({
      title: "Reporte enviado",
      description: "Un administrador revisará tu reporte"
    });
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar Contenido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivo del reporte</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica por qué reportas este contenido..."
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive">Enviar Reporte</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;