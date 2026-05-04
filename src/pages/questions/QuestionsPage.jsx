import QuestionList from '../../components/questions/QuestionList';

const QuestionsPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black text-dark-900">Preguntas</h1>
      <QuestionList limit={10} />
    </div>
  );
};

export default QuestionsPage;