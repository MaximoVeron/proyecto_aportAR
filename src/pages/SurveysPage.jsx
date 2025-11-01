import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateSurveyDialog from '@/components/CreateSurveyDialog';
import SurveyCard from '@/components/SurveyCard';

const SurveysPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadSurveys = () => {
    const storedSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    setSurveys(storedSurveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleSurveyCreated = () => {
    loadSurveys();
    setShowCreateDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Encuestas</h1>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Encuesta
        </Button>
      </div>

      <div className="space-y-6">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} onUpdate={loadSurveys} />
          ))
        ) : (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No hay encuestas disponibles aún.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              ¡Sé el primero en crear una encuesta para la comunidad!
            </p>
          </div>
        )}
      </div>

      <CreateSurveyDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSurveyCreated={handleSurveyCreated}
      />
    </motion.div>
  );
};

export default SurveysPage;
