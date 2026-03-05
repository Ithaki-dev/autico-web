import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-dark-100 rounded-xl flex items-center justify-center">
        <p className="text-dark-500 font-semibold">Sin imágenes disponibles</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative h-96 md:h-[500px] bg-dark-100 rounded-xl overflow-hidden group">
          <img
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Error+al+cargar';
            }}
          />

          {/* Zoom button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 p-3 bg-dark-950/80 backdrop-blur-sm text-white rounded-lg hover:bg-dark-900 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-dark-950/80 backdrop-blur-sm text-white rounded-full hover:bg-dark-900 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-dark-950/80 backdrop-blur-sm text-white rounded-full hover:bg-dark-900 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-dark-950/80 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`
                  relative h-20 rounded-lg overflow-hidden border-2 transition-all
                  ${
                    index === currentIndex
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-dark-200 hover:border-primary-300'
                  }
                `}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 bg-dark-950/95 backdrop-blur-md z-50"
            />

            {/* Lightbox Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 bg-dark-950/80 backdrop-blur-sm text-white rounded-full hover:bg-dark-900 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={images[currentIndex]}
                alt={`Imagen ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-4 p-3 bg-dark-950/80 backdrop-blur-sm text-white rounded-full hover:bg-dark-900 transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 p-3 bg-dark-950/80 backdrop-blur-sm text-white rounded-full hover:bg-dark-900 transition-colors"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-dark-950/80 backdrop-blur-sm text-white rounded-full font-semibold">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
