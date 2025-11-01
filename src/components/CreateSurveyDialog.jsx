import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CreateSurveyDialog = ({ open, onClose, onSurveyCreated }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, text: '', options: ['', ''] }
  ]);

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id)) + 1;
    setQuestions([...questions, { id: newId, text: '', options: ['', ''] }]);
  };

  const removeQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const updateQuestion = (questionId, text) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, text } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
        : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, index) => 
              index === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({ title: "Error", description: "El título y descripción son obligatorios", variant: "destructive" });
      return;
    }

    // Validar que todas las preguntas tengan texto y al menos 2 opciones válidas
    for (const question of questions) {
      if (!question.text.trim()) {
        toast({ title: "Error", description: "Todas las preguntas deben tener texto", variant: "destructive" });
        return;
      }
      
      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast({ title: "Error", description: "Cada pregunta debe tener al menos 2 opciones válidas", variant: "destructive" });
        return;
      }
    }

    const newSurvey = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      questions: questions.map(q => ({
        ...q,
        options: q.options.filter(opt => opt.trim())
      })),
      author: currentUser.name,
      authorId: currentUser.id,
      career: currentUser.career,
      createdAt: new Date().toISOString(),
      reactions: 0,
      responses: [] // Array para almacenar respuestas
    };

    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    surveys.push(newSurvey);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    toast({ title: "¡Encuesta creada!", description: "Tu encuesta ha sido publicada exitosamente" });
    
    // Reset form
    setTitle('');
    setDescription('');
    setQuestions([{ id: 1, text: '', options: ['', ''] }]);
    
    onSurveyCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Crear Nueva Encuesta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la encuesta</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de tu encuesta..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe de qué trata tu encuesta..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Preguntas</Label>
              <Button type="button" variant="outline" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={question.id} className="glass-effect rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Pregunta {questionIndex + 1}</Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <Input
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  required
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Opciones de respuesta</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Opción
                    </Button>
                  </div>
                  
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        placeholder={`Opción ${optionIndex + 1}`}
                        className="flex-1"
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(question.id, optionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Crear Encuesta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSurveyDialog;