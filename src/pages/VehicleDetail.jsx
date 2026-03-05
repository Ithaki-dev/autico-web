import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Gauge, Phone, Mail, User, 
  MessageCircle, Send, CheckCircle, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const isOwner = user && vehicle && (vehicle.owner._id === user.id || vehicle.owner === user.id);
  const isAvailable = vehicle?.status === 'available';

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Escribe tu pregunta');
      return;
    }

    if (!isAuthenticated()) {
      toast.error('Debes iniciar sesión para hacer preguntas');
      navigate('/login');
      return;
    }

    setSubmittingQuestion(true);
    try {
      await questionService.createQuestion(id, questionText);
      toast.success('Pregunta enviada correctamente');
      setQuestionText('');
      reload(); // Recargar para mostrar la nueva pregunta
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
      reload();
    } catch (error) {
      toast.error(error.message || 'Error al enviar la respuesta');
    } finally {
      setSubmittingAnswer(false);
    }
  };

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
              <div className="flex items-start justify-between mb-4">
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
                <div className="text-right">
                  <p className="text-4xl font-black text-secondary-500">
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
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={submittingQuestion}
                        disabled={!isAuthenticated() || submittingQuestion}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Pregunta
                      </Button>
                    </div>
                  </form>
                  {!isAuthenticated() && (
                    <p className="text-sm text-dark-600 mt-2">
                      Debes <Link to="/login" className="text-primary-600 font-semibold hover:underline">iniciar sesión</Link> para hacer preguntas
                    </p>
                  )}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {vehicle.questions && vehicle.questions.length > 0 ? (
                  vehicle.questions.map((question) => (
                    <div key={question._id} className="border border-dark-200 rounded-lg p-4">
                      {/* Question */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-bold">
                            {getInitials(question.user?.username || 'User')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark-900">{question.user?.username || 'Usuario'}</p>
                          <p className="text-dark-700 mt-1">{question.text}</p>
                          <p className="text-xs text-dark-500 mt-1">
                            {formatRelativeDate(question.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Answer */}
                      {question.answer ? (
                        <div className="ml-11 pl-4 border-l-2 border-secondary-300 bg-secondary-50 rounded-r-lg p-3">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="font-semibold text-secondary-700 text-sm">Respuesta del vendedor</p>
                              <p className="text-dark-700 mt-1">{question.answer.text}</p>
                              <p className="text-xs text-dark-500 mt-1">
                                {formatRelativeDate(question.answer.createdAt)}
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
                  ))
                ) : (
                  <p className="text-center text-dark-500 py-8">
                    Aún no hay preguntas sobre este vehículo
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
              <p className="text-dark-700">{selectedQuestion.text}</p>
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
