import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const SurveyDetailDialog = ({ open, onClose, survey, onResponseSubmitted }) => {
  const { currentUser } = useAuth();
  const [responses, setResponses] = useState({});

  const handleResponseChange = (questionId, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar que se respondieron todas las preguntas
    const allQuestionsAnswered = survey.questions.every(
      (q) => responses.hasOwnProperty(q.id) && responses[q.id] !== undefined
    );

    if (!allQuestionsAnswered) {
      toast({
        title: 'Error',
        description: 'Por favor responde todas las preguntas antes de enviar',
        variant: 'destructive',
      });
      return;
    }

    // Verificar si el usuario ya respondió
    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    const surveyIndex = surveys.findIndex((s) => s.id === survey.id);

    if (surveyIndex !== -1) {
      const existingResponse = surveys[surveyIndex].responses?.find(
        (r) => r.userId === currentUser.id
      );

      if (existingResponse) {
        toast({
          title: 'Error',
          description: 'Ya has respondido esta encuesta',
          variant: 'destructive',
        });
        return;
      }

      // Guardar respuesta
      const newResponse = {
        userId: currentUser.id,
        userName: currentUser.name,
        career: currentUser.career,
        responses: responses,
        submittedAt: new Date().toISOString(),
      };

      if (!surveys[surveyIndex].responses) {
        surveys[surveyIndex].responses = [];
      }

      surveys[surveyIndex].responses.push(newResponse);
      localStorage.setItem('surveys', JSON.stringify(surveys));

      toast({
        title: '¡Respuesta enviada!',
        description: 'Gracias por participar en la encuesta',
      });

      // Reset responses
      setResponses({});
      onResponseSubmitted();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">{survey?.title}</DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{survey?.description}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {survey?.questions.map((question, questionIndex) => (
            <Card key={question.id} className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Label className="text-lg font-semibold mb-4 block">
                  Pregunta {questionIndex + 1}: {question.text}
                </Label>

                <RadioGroup
                  value={responses[question.id]?.toString() || ''}
                  onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`q${question.id}-o${optionIndex}`}
                        className="text-green-600"
                      />
                      <Label
                        htmlFor={`q${question.id}-o${optionIndex}`}
                        className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Enviar Respuestas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDetailDialog;
