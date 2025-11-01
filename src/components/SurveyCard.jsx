import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Flag, BarChart3, Users, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import SurveyDetailDialog from '@/components/SurveyDetailDialog';
import SurveyResultsDialog from '@/components/SurveyResultsDialog';
import ReportDialog from '@/components/ReportDialog';
import CommentThread from '@/components/CommentThread';

const SurveyCard = ({ survey, onUpdate }) => {
  const { currentUser, getUserAvatar } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showSurveyDetail, setShowSurveyDetail] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({ postId: null, commentId: null, authorId: null });
  const [liked, setLiked] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    setAuthorAvatar(getUserAvatar(survey.authorId));
  }, [survey.authorId, getUserAvatar]);

  // Verificar si el usuario actual ya dio like a esta encuesta
  useEffect(() => {
    if (currentUser && survey.id) {
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      const hasLiked = userLikes[currentUser.id]?.includes(survey.id) || false;
      setLiked(hasLiked);
    }
  }, [currentUser, survey.id]);

  // Verificar si el usuario ya respondió esta encuesta
  useEffect(() => {
    if (currentUser && survey.responses) {
      const userResponse = survey.responses.find(r => r.userId === currentUser.id);
      setHasResponded(!!userResponse);
    }
  }, [currentUser, survey.responses]);

  const handleLike = () => {
    if (!currentUser) return;
    
    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    const surveyIndex = surveys.findIndex(s => s.id === survey.id);
    
    if (surveyIndex !== -1) {
      // Inicializar array de likes del usuario si no existe
      if (!userLikes[currentUser.id]) {
        userLikes[currentUser.id] = [];
      }
      
      const userLikesArray = userLikes[currentUser.id];
      const hasLiked = userLikesArray.includes(survey.id);
      
      if (hasLiked) {
        // Quitar like
        surveys[surveyIndex].reactions = Math.max(0, surveys[surveyIndex].reactions - 1);
        userLikes[currentUser.id] = userLikesArray.filter(id => id !== survey.id);
        setLiked(false);
      } else {
        // Agregar like
        surveys[surveyIndex].reactions += 1;
        userLikes[currentUser.id].push(survey.id);
        setLiked(true);
      }
      
      localStorage.setItem('surveys', JSON.stringify(surveys));
      localStorage.setItem('userLikes', JSON.stringify(userLikes));
      onUpdate();
    }
  };

  const handleDelete = () => {
    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    const newSurveys = surveys.filter(s => s.id !== survey.id);
    localStorage.setItem('surveys', JSON.stringify(newSurveys));
    toast({ title: "Encuesta eliminada" });
    onUpdate();
  };

  const handleReportSurvey = () => {
    setReportData({ postId: survey.id, commentId: null, authorId: survey.authorId });
    setShowReport(true);
  };

  const handleReportComment = (commentId) => {
    const comment = survey.comments.find(c => c.id === commentId);
    if (comment) {
      setReportData({ postId: survey.id, commentId: comment.id, authorId: comment.authorId });
      setShowReport(true);
    }
  };

  const canDelete = currentUser?.role === 'admin' || currentUser?.id === survey.authorId;
  const canSeeResults = currentUser?.id === survey.authorId;
  const responseCount = survey.responses?.length || 0;

  // Crear objeto post compatible para CommentThread
  const postForComments = {
    id: survey.id,
    title: survey.title,
    authorId: survey.authorId,
    comments: survey.comments || []
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-3xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
              {survey.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{survey.author}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {survey.career && `${survey.career} • `}
              {new Date(survey.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            Encuesta
          </span>
          {canDelete && (
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">{survey.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">{survey.description}</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-semibold">{survey.questions.length}</span> pregunta{survey.questions.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => setShowSurveyDetail(true)}
            disabled={hasResponded}
          >
            {hasResponded ? '✓ Ya respondiste' : 'Abrir Encuesta'}
          </Button>
          {canSeeResults && (
            <Button variant="outline" onClick={() => setShowResults(true)}>
              <Users className="w-4 h-4 mr-2" />
              Ver Resultados ({responseCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          {survey.reactions}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="w-5 h-5 mr-2" />
          {survey.comments?.length || 0} Comentarios
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReportSurvey}>
          <Flag className="w-5 h-5 mr-2" />
          Reportar
        </Button>
      </div>

      {showComments && (
        <CommentThread 
          post={postForComments} 
          onUpdate={onUpdate} 
          onReportComment={handleReportComment} 
        />
      )}

      <SurveyDetailDialog
        open={showSurveyDetail}
        onClose={() => setShowSurveyDetail(false)}
        survey={survey}
        onResponseSubmitted={onUpdate}
      />

      {canSeeResults && (
        <SurveyResultsDialog
          open={showResults}
          onClose={() => setShowResults(false)}
          survey={survey}
        />
      )}

      <ReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
        reportData={reportData}
      />
    </motion.div>
  );
};

export default SurveyCard;