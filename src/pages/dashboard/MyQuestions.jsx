import { useQuestions } from '../../hooks/useQuestions';
import { useVehicles } from '../../hooks/useVehicles';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import QuestionAnswer from '../../components/questions/QuestionAnswer';
import AnswerForm from '../../components/questions/AnswerForm';
import QuestionContextMeta from '../../components/questions/QuestionContextMeta';
import { formatRelativeDate } from '../../utils/formatters';

const MyQuestions = () => {
  const { user } = useAuth();
  const { questions, loading: questionsLoading } = useQuestions(100, 0);
  const { vehicles, loading: vehiclesLoading } = useVehicles(100, 0);

  if (questionsLoading || vehiclesLoading) {
    return <LoadingSpinner fullScreen text="Cargando preguntas sobre tus vehículos..." />;
  }

  // Obtener IDs de vehículos del usuario actual
  const myVehicleIds = vehicles
    .filter((v) => v.owner?.id === user?.id)
    .map((v) => v.id);

  // Filtrar preguntas sobre los vehículos del usuario actual
  const myQuestions = questions.filter((q) => 
    myVehicleIds.includes(q.vehicle?.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Preguntas sobre mis vehículos</h1>
      </div>

      {myQuestions.length === 0 ? (
        <EmptyState 
          title="No hay preguntas sobre tus vehículos"
          description="Cuando otros usuarios hagan preguntas sobre tus vehículos, aparecerán aquí"
        />
      ) : (
        <div className="space-y-4">
          {myQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-dark-900">{question.text}</h3>
                  <div className="mt-2">
                    <QuestionContextMeta userId={question?.user?.id} vehicleId={question?.vehicle?.id} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-dark-500">
                    <span>{formatRelativeDate(question.createdAt)}</span>
                    <span>{question.updatedAt ? `Actualizada ${formatRelativeDate(question.updatedAt)}` : ''}</span>
                  </div>
                </div>
              </div>

              <QuestionAnswer question={question} />
              <AnswerForm 
                questionId={question.id}
                onAnswerCreated={() => {
                  // Aquí podrías refrescar la pregunta si es necesario
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;
