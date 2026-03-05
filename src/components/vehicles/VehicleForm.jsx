import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es requerida').max(50),
  model: z.string().min(1, 'El modelo es requerido').max(50),
  year: z.coerce
    .number()
    .min(1900, 'El año debe ser mayor a 1900')
    .max(new Date().getFullYear() + 1, 'El año no puede ser mayor al año siguiente'),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  description: z.string().optional(),
});

const VehicleForm = ({ onSubmit, initialData, isLoading }) => {
  const [images, setImages] = useState(initialData?.images || []);
  const [imageUrl, setImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      description: '',
    },
  });

  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      toast.error('Ingresa una URL de imagen');
      return;
    }

    if (images.length >= 10) {
      toast.error('Máximo 10 imágenes permitidas');
      return;
    }

    // Validar que sea una URL
    try {
      new URL(imageUrl);
      setImages([...images, imageUrl]);
      setImageUrl('');
      toast.success('Imagen agregada');
    } catch {
      toast.error('URL de imagen inválida');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Imagen eliminada');
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      images: images,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <Input
          label="Marca"
          placeholder="Ej: Toyota, Honda, Ford..."
          error={errors.brand?.message}
          required
          {...register('brand')}
        />

        {/* Model */}
        <Input
          label="Modelo"
          placeholder="Ej: Corolla, Civic, Focus..."
          error={errors.model?.message}
          required
          {...register('model')}
        />

        {/* Year */}
        <Input
          label="Año"
          type="number"
          placeholder={new Date().getFullYear().toString()}
          error={errors.year?.message}
          required
          {...register('year')}
        />

        {/* Price */}
        <Input
          label="Precio"
          type="number"
          placeholder="250000"
          error={errors.price?.message}
          required
          {...register('price')}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Descripción"
        rows={5}
        placeholder="Describe el vehículo: características, estado, kilómetros, etc..."
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-dark-800 mb-2">
          Imágenes <span className="text-dark-500 font-normal">(máximo 10)</span>
        </label>

        {/* Add Image URL */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            containerClassName="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddImage}
            variant="secondary"
            disabled={images.length >= 10}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview Images */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-dark-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Error';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-dark-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-dark-400 mx-auto mb-2" />
            <p className="text-dark-600 font-medium">No hay imágenes agregadas</p>
            <p className="text-sm text-dark-500 mt-1">Agrega URLs de imágenes del vehículo</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          {initialData ? 'Actualizar Vehículo' : 'Publicar Vehículo'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
