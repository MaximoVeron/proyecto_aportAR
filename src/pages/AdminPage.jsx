import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Trash2, Ban } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-bold mb-4">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay datos para mostrar.</p>
      </div>
    );
  }
  const maxValue = Math.max(...data.map(item => item.value));
  const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
  return (
    <div className="glass-effect rounded-2xl p-6">
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate">{item.label}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                className={`${colors[index % colors.length]} h-4 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / (maxValue || 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="w-8 text-sm font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', role: 'all', career: 'all' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPendingUsers(JSON.parse(localStorage.getItem('pendingUsers') || '[]'));
    setReports(JSON.parse(localStorage.getItem('reports') || '[]').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAllUsers(JSON.parse(localStorage.getItem('users') || '[]'));
    setAllPosts(JSON.parse(localStorage.getItem('posts') || '[]'));
  };

  const stats = useMemo(() => {
    const postTypes = allPosts.reduce((acc, post) => {
      acc[post.type] = (acc[post.type] || 0) + 1;
      return acc;
    }, {});

    const postsByCareer = allPosts.reduce((acc, post) => {
      if (post.career) {
        acc[post.career] = (acc[post.career] || 0) + 1;
      }
      return acc;
    }, {});

    const usersByRole = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const usersByCareer = allUsers.reduce((acc, user) => {
      if (user.career) {
        acc[user.career] = (acc[user.career] || 0) + 1;
      }
      return acc;
    }, {});
    
    return {
      postTypes: [
        { label: 'Proyectos', value: postTypes.project || 0 },
        { label: 'Sugerencias', value: postTypes.suggestion || 0 },
        { label: 'Problemáticas', value: postTypes.problem || 0 },
      ],
      postsByCareer: Object.entries(postsByCareer).map(([label, value]) => ({ label, value })),
      usersByRole: Object.entries(usersByRole).map(([label, value]) => ({ label, value })),
      usersByCareer: Object.entries(usersByCareer).map(([label, value]) => ({ label, value })),
    };
  }, [allPosts, allUsers]);

  const approveUser = (userId) => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const user = pending.find(u => u.id === userId);
    
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ ...user, status: 'approved' });
      localStorage.setItem('users', JSON.stringify(users));
      
      const newPending = pending.filter(u => u.id !== userId);
      localStorage.setItem('pendingUsers', JSON.stringify(newPending));
      
      toast({ title: "Usuario aprobado", description: `${user.name} puede acceder ahora` });
      loadData();
    }
  };

  const rejectUser = (userId) => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const newPending = pending.filter(u => u.id !== userId);
    localStorage.setItem('pendingUsers', JSON.stringify(newPending));
    
    toast({ title: "Usuario rechazado", description: "Solicitud eliminada" });
    loadData();
  };

  const toggleBlockUser = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].blocked = !users[userIndex].blocked;
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: users[userIndex].blocked ? "Usuario bloqueado" : "Usuario desbloqueado",
        description: users[userIndex].blocked ? `${users[userIndex].name} no podrá acceder.` : `${users[userIndex].name} puede acceder nuevamente.`
      });
      loadData();
    }
  };
  
  const deleteContent = (report) => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === report.postId);

    if (postIndex !== -1) {
      if (report.commentId) {
        const comments = posts[postIndex].comments;
        const commentsToDelete = new Set([report.commentId]);
        let changed = true;
        while(changed) {
          changed = false;
          const currentSize = commentsToDelete.size;
          comments.forEach(c => {
            if (c.parentId && commentsToDelete.has(c.parentId)) commentsToDelete.add(c.id);
          });
          if (commentsToDelete.size > currentSize) changed = true;
        }
        posts[postIndex].comments = comments.filter(c => !commentsToDelete.has(c.id));
        toast({ title: "Comentario eliminado" });
      } else {
        posts.splice(postIndex, 1);
        toast({ title: "Publicación eliminada" });
      }
      localStorage.setItem('posts', JSON.stringify(posts));
    }
    resolveReport(report.id);
  };

  const resolveReport = (reportId) => {
    const currentReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const newReports = currentReports.filter(r => r.id !== reportId);
    localStorage.setItem('reports', JSON.stringify(newReports));
    toast({ title: "Reporte resuelto" });
    loadData();
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      if (user.role === 'admin') return false;
      const nameMatch = user.name.toLowerCase().includes(userFilters.name.toLowerCase());
      const roleMatch = userFilters.role === 'all' || user.role === userFilters.role;
      const careerMatch = userFilters.career === 'all' || user.career === userFilters.career;
      return nameMatch && roleMatch && careerMatch;
    });
  }, [allUsers, userFilters]);

  const handleUserFilterChange = (filterName, value) => {
    setUserFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const getReportedContent = (report) => {
    const post = allPosts.find(p => p.id === report.postId);
    if (!post) return { content: null, author: null };
    
    if (report.commentId) {
      const comment = post.comments.find(c => c.id === report.commentId);
      return { content: comment, author: allUsers.find(u => u.id === comment?.authorId) };
    }
    return { content: post, author: allUsers.find(u => u.id === post?.authorId) };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold gradient-text mb-8">Panel de Administración</h1>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="pending">Solicitudes ({pendingUsers.length})</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reports">Reportes ({reports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart data={stats.postTypes} title="Publicaciones por Tipo" />
            <BarChart data={stats.postsByCareer} title="Publicaciones por Carrera" />
            <BarChart data={stats.usersByRole} title="Usuarios por Rol" />
            <BarChart data={stats.usersByCareer} title="Estudiantes por Carrera" />
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingUsers.length > 0 ? pendingUsers.map(user => (
            <div key={user.id} className="glass-effect rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar><AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white">{user.name.charAt(0)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{user.role} {user.career && `- ${user.career}`}</p>
                </div>
              </div>
              <div className="flex gap-2"><Button size="sm" onClick={() => approveUser(user.id)}><Check className="w-4 h-4 mr-1"/>Aprobar</Button><Button size="sm" variant="destructive" onClick={() => rejectUser(user.id)}><X className="w-4 h-4 mr-1"/>Rechazar</Button></div>
            </div>
          )) : <div className="glass-effect rounded-3xl p-12 text-center"><p className="text-gray-600 dark:text-gray-400">No hay solicitudes pendientes.</p></div>}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="glass-effect rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Buscar por nombre..." value={userFilters.name} onChange={e => handleUserFilterChange('name', e.target.value)} />
            <Select value={userFilters.role} onValueChange={value => handleUserFilterChange('role', value)}>
              <SelectTrigger><SelectValue placeholder="Filtrar por rol"/></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos los roles</SelectItem><SelectItem value="estudiante">Estudiante</SelectItem><SelectItem value="profesor">Profesor</SelectItem><SelectItem value="administrativo">Administrativo</SelectItem><SelectItem value="trabajador">Trabajador</SelectItem></SelectContent>
            </Select>
            <Select value={userFilters.career} onValueChange={value => handleUserFilterChange('career', value)}>
              <SelectTrigger><SelectValue placeholder="Filtrar por carrera"/></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas las carreras</SelectItem><SelectItem value="Software">Software</SelectItem><SelectItem value="Telecomunicaciones">Telecomunicaciones</SelectItem><SelectItem value="Química Industrial">Química Industrial</SelectItem><SelectItem value="Mecatrónica">Mecatrónica</SelectItem></SelectContent>
            </Select>
          </div>
          {filteredUsers.map(user => (
            <div key={user.id} className="glass-effect rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar><AvatarImage src={user.avatar} /><AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">{user.name.charAt(0)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-bold">{user.name} {user.blocked && <span className="text-xs text-red-500 font-bold">(BLOQUEADO)</span>}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{user.role} {user.career && `- ${user.career}`}</p>
                </div>
              </div>
              <Button size="sm" variant={user.blocked ? 'outline' : 'destructive'} onClick={() => toggleBlockUser(user.id)}><Ban className="w-4 h-4 mr-1"/>{user.blocked ? 'Desbloquear' : 'Bloquear'}</Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {reports.length > 0 ? reports.map(report => {
            const { content, author } = getReportedContent(report);
            return (
              <div key={report.id} className="glass-effect rounded-2xl p-6">
                <div className="mb-4">
                  <p>Reportado por: <span className="font-semibold">{report.reporterName}</span></p>
                  <p>Motivo: <span className="italic text-gray-700 dark:text-gray-300">{report.reason}</span></p>
                </div>
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                  <h4 className="font-bold mb-2">Contenido Reportado:</h4>
                  {content ? (
                    <div className="glass-effect rounded-lg p-4 bg-white/50 dark:bg-black/20">
                      <p className="font-semibold">{content.title || `Comentario de ${content.author}`}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{content.description || content.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Autor: {author?.name || 'N/A'}</p>
                    </div>
                  ) : <p>Contenido no encontrado o eliminado.</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="destructive" onClick={() => deleteContent(report)} disabled={!content}><Trash2 className="w-4 h-4 mr-1"/>Eliminar Contenido</Button>
                  <Button size="sm" variant="destructive" onClick={() => toggleBlockUser(report.authorId)} disabled={!author}><Ban className="w-4 h-4 mr-1"/>Bloquear Autor</Button>
                  <Button size="sm" variant="outline" onClick={() => resolveReport(report.id)}>Marcar como resuelto</Button>
                </div>
              </div>
            )
          }) : <div className="glass-effect rounded-3xl p-12 text-center"><p className="text-gray-600 dark:text-gray-400">No hay reportes pendientes.</p></div>}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminPage;