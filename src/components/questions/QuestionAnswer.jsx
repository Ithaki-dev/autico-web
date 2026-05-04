import { useAnswersForQuestion } from '../../hooks/useQuestions';
import { formatRelativeDate } from '../../utils/formatters';
import { useUserById } from '../../hooks/useAuth';

const AnswerAuthor = ({ userId }) => {
  const { user, loading } = useUserById(userId);

  if (loading) {
    return <span className="text-xs text-dark-500">Cargando autor...</span>;
  }

  return <span className="text-xs text-dark-700 font-semibold">{user?.username || user?.name || userId || 'Usuario'}</span>;
};

const QuestionAnswer = ({ question }) => {
  const embeddedAnswer = question?.answer ? [question.answer] : [];
  const shouldFetchAnswers = embeddedAnswer.length === 0;
  const { answers, loading, error } = useAnswersForQuestion(question?.id, shouldFetchAnswers);
  const answerList = shouldFetchAnswers ? answers : embeddedAnswer;

  if (shouldFetchAnswers && loading) {
    return <p className="text-sm text-dark-500">Cargando respuestas...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">No se pudieron cargar las respuestas.</p>;
  }

  if (!answerList.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-dark-200 p-4">
        <p className="text-sm text-dark-600">Todavía no hay respuesta.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {answerList.map((answer, index) => (
        <div
          key={`${question?.id || 'question'}-answer-${index}`}
          className="rounded-lg border border-secondary-200 bg-secondary-50 p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <AnswerAuthor userId={answer?.user?.id} />
            <span className="text-xs text-dark-500">
              {answer?.createdAt ? formatRelativeDate(answer.createdAt) : ''}
            </span>
          </div>
          <p className="text-sm text-dark-800 whitespace-pre-line">
            {answer?.text || 'Sin texto de respuesta'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuestionAnswer;