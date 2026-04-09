import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ExternalLink, CheckCircle, Clock, Inbox, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { questionService } from '../../api/questionService';
import { vehicleService } from '../../api/vehicleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { formatRelativeDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const MyQuestions = () => {
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [receivedQuestions, setReceivedQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  const getQuestionText = (question) => {
    return question?.text || question?.question || question?.message || '';
  };

  const getAnswerText = (question) => {
    if (!question?.answer) return '';
    if (typeof question.answer === 'string') return question.answer;
    return question.answer.text || question.answer.message || '';
  };

  const getAnswerDate = (question) => {
    if (!question?.answer) return null;
    if (typeof question.answer === 'string') return question.updatedAt || question.createdAt;
    return question.answer.createdAt || question.updatedAt || question.createdAt;
  };

  const getAskerName = (question) => {
    if (question?.user?.username) return question.user.username;
    return question?.username || 'Usuario';
  };

  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };

  const getVehicleId = (question) => {
    return getEntityId(question?.vehicle) || question?.vehicleId || null;
  };

  const loadMyQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const [askedResponse, vehiclesResponse] = await Promise.all([
        questionService.getMyQuestions(),
        vehicleService.getMyVehicles(),
      ]);

      const asked = askedResponse?.success && Array.isArray(askedResponse.data)
        ? askedResponse.data
        : [];
      setAskedQuestions(asked);

      const myVehicles = vehiclesResponse?.success && Array.isArray(vehiclesResponse.data)
        ? vehiclesResponse.data
        : [];

      const receivedLists = await Promise.all(
        myVehicles.map(async (vehicle) => {
          const vehicleQuestions = await questionService.getVehicleQuestions(vehicle._id).catch(() => []);

          return vehicleQuestions.map((question) => ({
            ...question,
            vehicle: question.vehicle || vehicle,
            vehicleId: getEntityId(question.vehicle) || vehicle._id,
          }));
        })
      );

      const received = receivedLists
        .flat()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReceivedQuestions(received);

      if (received.length === 0 && asked.length > 0) {
        setActiveTab('asked');
      }
    } catch (error) {
      toast.error('Error al cargar tus preguntas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyQuestions();
  }, [loadMyQuestions]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando tus preguntas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
            Centro de Preguntas
          </h1>
          <div className="flex flex-wrap gap-3 text-sm md:text-base text-dark-600">
            <span>{receivedQuestions.length} recibida{receivedQuestions.length !== 1 ? 's' : ''}</span>
            <span>{askedQuestions.length} realizada{askedQuestions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-2 mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'received'
                ? 'bg-primary-500 text-white'
                : 'text-dark-700 hover:bg-gray-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Recibidas
            {receivedQuestions.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'received' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
                {receivedQuestions.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('asked')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'asked'
                ? 'bg-primary-500 text-white'
                : 'text-dark-700 hover:bg-gray-100'
            }`}
          >
            <Send className="w-4 h-4" />
            Realizadas
            {askedQuestions.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'asked' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
                {askedQuestions.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'received' && receivedQuestions.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No tienes preguntas recibidas"
            description="Cuando alguien pregunte por tus vehículos, aparecerá aquí"
            action={() => window.location.href = '/dashboard/vehicles'}
            actionLabel="Ver Mis Vehículos"
          />
        ) : activeTab === 'asked' && askedQuestions.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No has realizado preguntas"
            description="Las preguntas que hagas sobre vehículos aparecerán aquí"
            action={() => window.location.href = '/vehicles'}
            actionLabel="Explorar Vehículos"
          />
        ) : (
          <div className="space-y-4">
            {(activeTab === 'received' ? receivedQuestions : askedQuestions).map((question, index) => {
              const vehicleId = getVehicleId(question);

              return (
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
                        {question.vehicle?.brand || 'Vehículo'} {question.vehicle?.model || ''} {question.vehicle?.year || ''}
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
                    {vehicleId && (
                      <Link
                        to={`/vehicles/${vehicleId}`}
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
                    <p className="text-sm font-semibold text-dark-600 mb-2">
                      {activeTab === 'received' ? `Pregunta de ${getAskerName(question)}:` : 'Tu pregunta:'}
                    </p>
                    <p className="text-dark-900 bg-gray-50 p-4 rounded-lg border border-dark-200">
                      {getQuestionText(question)}
                    </p>
                  </div>

                  {/* Answer */}
                  {question.answer && (
                    <div>
                      <p className="text-sm font-semibold text-secondary-600 mb-2">
                        Respuesta del vendedor:
                      </p>
                      <div className="bg-secondary-50 border border-secondary-200 p-4 rounded-lg">
                        <p className="text-dark-900">{getAnswerText(question)}</p>
                        <p className="text-xs text-dark-500 mt-2">
                          {formatRelativeDate(getAnswerDate(question))}
                        </p>
                      </div>
                    </div>
                  )}

                  {!question.answer && activeTab === 'received' && (
                    <p className="text-sm text-warning-700 bg-warning-50 border border-warning-200 rounded-lg p-3">
                      Pendiente de respuesta. Ábrela en el detalle del vehículo para responder.
                    </p>
                  )}
                </div>
              </motion.div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuestions;
