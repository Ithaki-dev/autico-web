import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Phone, Mail,
  MessageCircle, Send, CheckCircle, AlertCircle, Copy, Link as LinkIcon
} from 'lucide-react';
import { useVehicle } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../api/questionService';
import ImageGallery from '../components/vehicles/ImageGallery';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Textarea from '../components/common/Textarea';
import Modal from '../components/common/Modal';
import { formatPrice, formatRelativeDate, formatPhone, getInitials } from '../utils/formatters';
import toast from 'react-hot-toast';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading, reload } = useVehicle(id);
  const { user, isAuthenticated } = useAuth();
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [copyingLink, setCopyingLink] = useState(false);

  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };

  const getQuestionText = (question) => {
    return question?.text || question?.question || question?.message || '';
  };

  const getQuestionAuthorName = (question) => {
    if (question?.user?.username) return question.user.username;
    return question?.username || 'Usuario';
  };

  const getAnswerData = (question) => {
    if (!question?.answer) return null;

    if (typeof question.answer === 'string') {
      return {
        text: question.answer,
        createdAt: question.updatedAt || question.createdAt,
      };
    }

    const answerText = question.answer.text || question.answer.message;
    if (!answerText) return null;

    return {
      text: answerText,
      createdAt: question.answer.createdAt || question.updatedAt || question.createdAt,
    };
  };

  const currentUserId = getEntityId(user);
  const ownerId = getEntityId(vehicle?.owner);
  const isLoggedIn = isAuthenticated();
  const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId);
  const isAvailable = vehicle?.status === 'available';
  const allQuestions = questions;

  const visibleQuestions = allQuestions.filter((question) => {
    if (!isLoggedIn) return false;
    if (isOwner) return true;

    const questionOwnerId = getEntityId(question?.user);
    return Boolean(questionOwnerId && questionOwnerId === currentUserId);
  });

  const hasPendingQuestion = !isOwner && visibleQuestions.some((question) => !getAnswerData(question));
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/vehicles/${id}`
    : `/vehicles/${id}`;

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;

    setCopyingLink(true);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast.success('Enlace copiado al portapapeles');
    } catch (error) {
      toast.error('No se pudo copiar el enlace');
    } finally {
      setCopyingLink(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Escribe tu pregunta');
      return;
    }

    if (hasPendingQuestion) {
      toast.error('Debes esperar la respuesta del vendedor antes de enviar otra pregunta');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para hacer preguntas');
      navigate('/login');
      return;
    }

    setSubmittingQuestion(true);
    try {
      await questionService.createQuestion(id, questionText);
      toast.success('Pregunta enviada correctamente');
      setQuestionText('');
      await Promise.all([reload(), loadQuestions()]);
    } catch (error) {
      toast.error(error.message || 'Error al enviar la pregunta');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      toast.error('Escribe tu respuesta');
      return;
    }

    setSubmittingAnswer(true);
    try {
      await questionService.answerQuestion(selectedQuestion._id, answerText);
      toast.success('Respuesta enviada correctamente');
      setAnswerText('');
      setSelectedQuestion(null);
      setIsAnswering(false);
      await Promise.all([reload(), loadQuestions()]);
    } catch (error) {
      toast.error(error.message || 'Error al enviar la respuesta');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const loadQuestions = async () => {
    if (!id) return;

    setLoadingQuestions(true);
    try {
      const questionsData = await questionService.getVehicleQuestions(id);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (error) {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando vehículo..." />;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Vehículo no encontrado</h2>
          <p className="text-dark-600 mb-6">El vehículo que buscas no existe o ha sido eliminado</p>
          <Link to="/vehicles">
            <Button variant="primary">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/vehicles" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={vehicle.images} />

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-dark-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">{vehicle.year}</span>
                    </div>
                    <Badge variant={isAvailable ? 'success' : 'danger'}>
                      {isAvailable ? 'Disponible' : 'Vendido'}
                    </Badge>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <p className="text-2xl sm:text-4xl font-black text-secondary-500 break-words">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="pt-6 border-t border-dark-200">
                  <h3 className="text-lg font-bold text-dark-900 mb-3">Descripción</h3>
                  <p className="text-dark-700 whitespace-pre-line leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="pt-6 border-t border-dark-200 mt-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Detalles del Vehículo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Marca</p>
                    <p className="font-bold text-dark-900">{vehicle.brand}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Modelo</p>
                    <p className="font-bold text-dark-900">{vehicle.model}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Año</p>
                    <p className="font-bold text-dark-900">{vehicle.year}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Precio</p>
                    <p className="font-bold text-secondary-500">{formatPrice(vehicle.price)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions & Answers */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              <h3 className="text-xl font-bold text-dark-900 mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-primary-500" />
                Preguntas y Respuestas
              </h3>

              {/* Ask Question Form */}
              {!isOwner && isAvailable && (
                <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <form onSubmit={handleAskQuestion}>
                    <Textarea
                      placeholder="Haz una pregunta sobre este vehículo..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      rows={3}
                      className="bg-white"
                      disabled={hasPendingQuestion || submittingQuestion}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={submittingQuestion}
                        disabled={!isLoggedIn || submittingQuestion || hasPendingQuestion}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Pregunta
                      </Button>
                    </div>
                  </form>
                  {!isLoggedIn && (
                    <p className="text-sm text-dark-600 mt-2">
                      Debes <Link to="/login" className="text-primary-600 font-semibold hover:underline">iniciar sesión</Link> para hacer preguntas
                    </p>
                  )}
                  {isLoggedIn && hasPendingQuestion && (
                    <p className="text-sm text-warning-700 mt-2">
                      Ya tienes una pregunta pendiente en este vehículo. Podrás enviar otra cuando el vendedor responda.
                    </p>
                  )}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {loadingQuestions ? (
                  <p className="text-center text-dark-500 py-8">
                    Cargando preguntas...
                  </p>
                ) : !isLoggedIn ? (
                  <p className="text-center text-dark-500 py-8">
                    Inicia sesión para ver preguntas y respuestas de este vehículo
                  </p>
                ) : visibleQuestions.length > 0 ? (
                  visibleQuestions.map((question) => {
                    const answerData = getAnswerData(question);

                    return (
                    <div key={question._id} className="border border-dark-200 rounded-lg p-4">
                      {/* Question */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-bold">
                            {getInitials(getQuestionAuthorName(question))}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark-900">{getQuestionAuthorName(question)}</p>
                          <p className="text-dark-700 mt-1">{getQuestionText(question)}</p>
                          <p className="text-xs text-dark-500 mt-1">
                            {formatRelativeDate(question.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Answer */}
                      {answerData ? (
                        <div className="ml-11 pl-4 border-l-2 border-secondary-300 bg-secondary-50 rounded-r-lg p-3">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="font-semibold text-secondary-700 text-sm">Respuesta del vendedor</p>
                              <p className="text-dark-700 mt-1">{answerData.text}</p>
                              <p className="text-xs text-dark-500 mt-1">
                                {formatRelativeDate(answerData.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        isOwner && (
                          <div className="ml-11">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedQuestion(question);
                                setIsAnswering(true);
                              }}
                            >
                              Responder
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                    );
                  })
                ) : (
                  <p className="text-center text-dark-500 py-8">
                    {isOwner
                      ? 'Aún no hay preguntas sobre este vehículo'
                      : 'Todavía no tienes preguntas en este vehículo'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Seller Info */}
              <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Información del Vendedor</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-lg text-white font-bold">
                      {getInitials(vehicle.owner?.username || 'User')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900">{vehicle.owner?.username || 'Usuario'}</p>
                    <p className="text-sm text-dark-500">Vendedor</p>
                  </div>
                </div>

                {vehicle.owner?.email && (
                  <div className="flex items-center space-x-2 text-dark-700 mb-2">
                    <Mail className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{vehicle.owner.email}</span>
                  </div>
                )}

                {vehicle.owner?.phone && (
                  <div className="flex items-center space-x-2 text-dark-700">
                    <Phone className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{formatPhone(vehicle.owner.phone)}</span>
                  </div>
                )}

                {!isOwner && isAvailable && (
                  <Button variant="warning" className="w-full mt-4">
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar Vendedor
                  </Button>
                )}
              </div>

              {/* Publication Info */}
              <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Información de Publicación</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-dark-600">Publicado</p>
                    <p className="font-semibold text-dark-900">{formatRelativeDate(vehicle.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-dark-600">Estado</p>
                    <Badge variant={isAvailable ? 'success' : 'danger'}>
                      {isAvailable ? 'Disponible' : 'Vendido'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Share Link */}
              <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-primary-500" />
                  Compartir Vehículo
                </h3>

                <p className="text-sm text-dark-600 mb-3">
                  Comparte este enlace público del vehículo.
                </p>

                <div className="bg-gray-50 border border-dark-200 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs text-dark-700 break-all">{shareUrl}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleCopyShareUrl}
                    loading={copyingLink}
                    disabled={copyingLink}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar enlace
                  </Button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="ghost" size="sm">
                      Abrir
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Modal */}
      <Modal
        isOpen={isAnswering}
        onClose={() => {
          setIsAnswering(false);
          setSelectedQuestion(null);
          setAnswerText('');
        }}
        title="Responder Pregunta"
        size="md"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-dark-900 mb-2">Pregunta:</p>
              <p className="text-dark-700">{getQuestionText(selectedQuestion)}</p>
            </div>
            
            <form onSubmit={handleAnswerQuestion}>
              <Textarea
                label="Tu respuesta"
                placeholder="Escribe tu respuesta..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={4}
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAnswering(false);
                    setSelectedQuestion(null);
                    setAnswerText('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  loading={submittingAnswer}
                  disabled={submittingAnswer}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Respuesta
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VehicleDetail;
