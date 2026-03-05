import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { questionService } from '../../api/questionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { formatRelativeDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyQuestions();
  }, []);

  const loadMyQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionService.getMyQuestions();
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar tus preguntas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando tus preguntas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
            Mis Preguntas
          </h1>
          <p className="text-lg text-dark-600">
            {questions.length} pregunta{questions.length !== 1 ? 's' : ''} realizada{questions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No has realizado preguntas"
            description="Las preguntas que hagas sobre vehículos aparecerán aquí"
            action={() => window.location.href = '/vehicles'}
            actionLabel="Explorar Vehículos"
          />
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-metal border border-dark-200 overflow-hidden"
              >
                {/* Vehicle Info Header */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-dark-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark-900 mb-1">
                        {question.vehicle?.brand} {question.vehicle?.model} {question.vehicle?.year}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default" size="sm">
                          {formatRelativeDate(question.createdAt)}
                        </Badge>
                        {question.answer ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Respondida
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>
                    {question.vehicle && (
                      <Link
                        to={`/vehicles/${question.vehicle._id}`}
                        className="ml-4 p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-primary-600" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Question & Answer */}
                <div className="p-6 space-y-4">
                  {/* Question */}
                  <div>
                    <p className="text-sm font-semibold text-dark-600 mb-2">Tu pregunta:</p>
                    <p className="text-dark-900 bg-gray-50 p-4 rounded-lg border border-dark-200">
                      {question.text}
                    </p>
                  </div>

                  {/* Answer */}
                  {question.answer && (
                    <div>
                      <p className="text-sm font-semibold text-secondary-600 mb-2">
                        Respuesta del vendedor:
                      </p>
                      <div className="bg-secondary-50 border border-secondary-200 p-4 rounded-lg">
                        <p className="text-dark-900">{question.answer.text}</p>
                        <p className="text-xs text-dark-500 mt-2">
                          {formatRelativeDate(question.answer.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuestions;
