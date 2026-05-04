import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuestionsByVehicle } from '../../hooks/useQuestions';
import { useAuth } from '../../hooks/useAuth';
import { questionService } from '../../api/questionService';
import QuestionContextMeta from './QuestionContextMeta';
import QuestionAnswer from './QuestionAnswer';
import AnswerForm from './AnswerForm';
import Button from '../common/Button';
import Textarea from '../common/Textarea';

const QuestionsByVehicle = ({ vehicleId, vehicleOwner }) => {
  const { isAuthenticated, user } = useAuth();
  const { questions, loading, error, refetch } = useQuestionsByVehicle(vehicleId);
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Verificar si el usuario actual es el dueño del vehículo
  const isVehicleOwner = useMemo(() => {
    if (!user || !vehicleOwner) return false;
    const userId = user.id || user._id;
    const ownerId = vehicleOwner.id || vehicleOwner._id;
    return userId === ownerId;
  }, [user, vehicleOwner]);

  // Verificar si el usuario actual tiene una pregunta sin respuesta
  const userHasUnansweredQuestion = useMemo(() => {
    if (!isAuthenticated() || !user) return false;
    const userId = user.id || user._id;
    return questions.some(
      (q) => (q.user?.id === userId || q.user?._id === userId) && !q.answer
    );
  }, [questions, user, isAuthenticated]);

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();

    if (!questionText.trim()) {
      toast.error('Escribe tu pregunta');
      return;
    }

    if (!isAuthenticated()) {
      toast.error('Debes iniciar sesión para hacer preguntas');
      return;
    }

    try {
      setSubmitting(true);
      await questionService.createQuestion(vehicleId, questionText.trim());
      toast.success('Pregunta enviada correctamente');
      setQuestionText('');
      await refetch();
    } catch (requestError) {
      toast.error(requestError?.message || 'Error al enviar la pregunta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-dark-500">Cargando preguntas del vehículo...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dark-200 bg-white p-5">
        <h4 className="text-lg font-bold text-dark-900 mb-2">Haz una pregunta</h4>
        {!isAuthenticated() ? (
          <p className="text-dark-600 text-sm">
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Inicia sesión
            </Link>{' '}
            para preguntar sobre este vehículo.
          </p>
        ) : userHasUnansweredQuestion ? (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-orange-800">
              Ya tienes una pregunta sin respuesta. Espera a que el vendedor responda antes de hacer otra pregunta.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <Textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              rows={4}
              placeholder="Escribe tu pregunta para el vendedor..."
              className="bg-white"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                Enviar pregunta
              </Button>
            </div>
          </form>
        )}
      </div>

      {!questions.length ? (
        <div className="rounded-xl border border-dashed border-dark-200 bg-white p-6 text-center">
          <p className="text-dark-600">No hay preguntas para este vehículo.</p>
        </div>
      ) : (
        questions.map((question) => (
          <article key={question.id} className="rounded-xl border border-dark-200 bg-white p-5">
            <h3 className="text-lg font-bold text-dark-900">{question.text}</h3>

            <div className="mt-2">
              <QuestionContextMeta userId={question?.user?.id} showVehicle={false} />
            </div>

            <QuestionAnswer question={question} />

            {isVehicleOwner && !question.answer && (
              <AnswerForm questionId={question.id} onAnswerCreated={refetch} />
            )}
          </article>
        ))
      )}
    </div>
  );
};

export default QuestionsByVehicle;