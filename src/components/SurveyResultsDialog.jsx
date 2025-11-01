import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3 } from 'lucide-react';

const SurveyResultsDialog = ({ open, onClose, survey }) => {
  const totalResponses = survey?.responses?.length || 0;

  // Calcular estadísticas por pregunta
  const getQuestionStats = (question) => {
    if (!survey.responses || survey.responses.length === 0) {
      return question.options.map((option, index) => ({
        option,
        count: 0,
        percentage: 0
      }));
    }

    const stats = question.options.map((option, index) => {
      const count = survey.responses.filter(response => 
        response.responses[question.id] === index
      ).length;
      
      const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
      
      return {
        option,
        count,
        percentage: Math.round(percentage * 100) / 100
      };
    });

    return stats;
  };

  const getProgressBarWidth = (percentage) => {
    return `${Math.max(percentage, 2)}%`; // Mínimo 2% para visibilidad
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Resultados de la Encuesta
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {survey?.title}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumen general */}
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {totalResponses}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Participante{totalResponses !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Creada el {new Date(survey?.createdAt).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {survey?.questions?.length} pregunta{survey?.questions?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados por pregunta */}
          {survey?.questions?.map((question, questionIndex) => {
            const stats = getQuestionStats(question);
            
            return (
              <Card key={question.id} className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pregunta {questionIndex + 1}: {question.text}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalResponses} respuesta{totalResponses !== 1 ? 's' : ''} total{totalResponses !== 1 ? 'es' : ''}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stat.option}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.count} voto{stat.count !== 1 ? 's' : ''}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {stat.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: getProgressBarWidth(stat.percentage) }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          {/* Lista de participantes (solo nombres) */}
          {totalResponses > 0 && (
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {survey.responses.map((response, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="font-medium">{response.userName}</span>
                      {response.career && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          ({response.career})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {totalResponses === 0 && (
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Aún no hay respuestas para esta encuesta.
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  Los resultados aparecerán aquí cuando los usuarios comiencen a responder.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyResultsDialog;