import { useState } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import QuestionContextMeta from './QuestionContextMeta';
import QuestionAnswer from './QuestionAnswer';

const QuestionList = ({ limit = 10 }) => {
  const [offset, setOffset] = useState(0);
  const { questions, loading, error } = useQuestions(limit, offset);

  if (loading) {
    return <p className="text-dark-500">Cargando preguntas...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!questions.length) {
    return (
      <div className="rounded-xl border border-dashed border-dark-200 bg-white p-6 text-center">
        <p className="text-dark-600">No hay preguntas todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <article key={question.id} className="rounded-xl border border-dark-200 bg-white p-5">
          <h3 className="text-lg font-bold text-dark-900">{question.text}</h3>

          <div className="mt-2">
            <QuestionContextMeta userId={question?.user?.id} vehicleId={question?.vehicle?.id} />
          </div>

          <div className="mt-3 text-xs text-dark-500">
            {question?.createdAt ? new Date(question.createdAt).toLocaleString() : ''}
          </div>

          <QuestionAnswer question={question} />
        </article>
      ))}

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          className="rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={offset === 0}
          onClick={() => setOffset((current) => Math.max(0, current - limit))}
        >
          Anterior
        </button>

        <button
          type="button"
          className="rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={questions.length < limit}
          onClick={() => setOffset((current) => current + limit)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default QuestionList;