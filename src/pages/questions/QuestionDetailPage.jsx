import { useParams } from 'react-router-dom';
import QuestionDetail from '../../components/questions/QuestionDetail';

const QuestionDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <QuestionDetail questionId={id} />
    </div>
  );
};

export default QuestionDetailPage;