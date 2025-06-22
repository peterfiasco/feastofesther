import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Lightbox = ({ images, currentIndex, onClose, onPrevious, onNext }) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Restore scrolling when lightbox closes
    };
  }, [onClose, onPrevious, onNext]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="lightbox-close-btn" 
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ×
        </button>
        
        <button 
          className="lightbox-nav-btn prev-btn" 
          onClick={onPrevious}
          aria-label="Previous image"
        >
          ❮
        </button>
        
        <div className="lightbox-img-wrapper">
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="lightbox-img" 
          />
        </div>
        
        <button 
          className="lightbox-nav-btn next-btn" 
          onClick={onNext}
          aria-label="Next image"
        >
          ❯
        </button>
        
        <div className="lightbox-caption">
          <p>{images[currentIndex].alt}</p>
          <span className="image-counter">{currentIndex + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  );
};

Lightbox.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Lightbox;
