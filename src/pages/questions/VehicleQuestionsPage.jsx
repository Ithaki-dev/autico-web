import { useParams } from 'react-router-dom';
import QuestionsByVehicle from '../../components/questions/QuestionsByVehicle';

const VehicleQuestionsPage = () => {
  const { vehicleId } = useParams();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <QuestionsByVehicle vehicleId={vehicleId} />
    </div>
  );
};

export default VehicleQuestionsPage;