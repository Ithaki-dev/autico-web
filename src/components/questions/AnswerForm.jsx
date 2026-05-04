import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { answerService } from '../../api/answerService';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const answerSchema = z.object({
  text: z.string().min(10, 'La respuesta debe tener al menos 10 caracteres').max(5000, 'Máximo 5000 caracteres'),
});

const AnswerForm = ({ questionId, onAnswerCreated }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: { text: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await answerService.createAnswer(questionId, { text: data.text });
      toast.success('¡Respuesta enviada correctamente!');
      reset();
      setShowForm(false);
      if (onAnswerCreated) {
        onAnswerCreated();
      }
    } catch (error) {
      toast.error(error?.message || 'Error al enviar la respuesta');
      console.error('Error creating answer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowForm(true)}
        >
          Responder pregunta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div>
        <label className="block text-sm font-semibold text-dark-900 mb-2">
          Tu respuesta
        </label>
        <Textarea
          placeholder="Escribe tu respuesta aquí..."
          {...register('text')}
          rows={4}
        />
        {errors.text && <p className="text-sm text-red-600 mt-1">{errors.text.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="sm"
        >
          {loading ? 'Enviando...' : 'Enviar respuesta'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowForm(false);
            reset();
          }}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default AnswerForm;
