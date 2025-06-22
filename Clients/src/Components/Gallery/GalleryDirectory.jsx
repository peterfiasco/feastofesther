import React from 'react';
import PropTypes from 'prop-types';

const GalleryDirectory = ({ directory, onClick }) => {
  return (
    <div 
      className="directory-container"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${directory.title} gallery`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="directory-image-container">
        <img 
          src={directory.coverImage}
          alt={`${directory.title} cover`}
          className="directory-cover-image"
          loading="lazy"
        />
        <div className="directory-overlay">
          <div className="directory-folder-icon">📁</div>
          <div className="image-count">{directory.images.length} Photos</div>
        </div>
      </div>
      <h3 className="directory-title">{directory.title}</h3>
    </div>
  );
};

GalleryDirectory.propTypes = {
  directory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GalleryDirectory;
