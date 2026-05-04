import { useQuestionById } from '../../hooks/useQuestions';
import QuestionContextMeta from './QuestionContextMeta';
import QuestionAnswer from './QuestionAnswer';

const QuestionDetail = ({ questionId }) => {
  const { question, loading, error } = useQuestionById(questionId);

  if (loading) {
    return <p className="text-dark-500">Cargando pregunta...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!question) {
    return <p className="text-dark-500">No existe esta pregunta.</p>;
  }

  return (
    <article className="rounded-xl border border-dark-200 bg-white p-6">
      <h2 className="text-xl font-bold text-dark-900">{question.text}</h2>

      <div className="mt-3">
        <QuestionContextMeta userId={question?.user?.id} vehicleId={question?.vehicle?.id} />
      </div>

      <div className="mt-4 text-sm text-dark-500">
        <p>Creada: {question.createdAt ? new Date(question.createdAt).toLocaleString() : 'N/D'}</p>
        <p>Actualizada: {question.updatedAt ? new Date(question.updatedAt).toLocaleString() : 'N/D'}</p>
      </div>

      <QuestionAnswer question={question} />
    </article>
  );
};

export default QuestionDetail;