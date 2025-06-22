import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GalleryDirectory from '../../../src/Components/Gallery/GalleryDirectory';
import Lightbox from '../../../src/Components/Gallery/Lightbox';
import './Gallery.css';

// Import directory cover images
import inauguralBreakfastCover from '../Images/FEASTOFESTHERIMAGES/gallery/2017 INAUGURAL BREAKFAST AT FAYETTIEVILLE  NORTH-CAROLINA/20180210_111244.jpg';
import houstonCover from '../Images/FEASTOFESTHERIMAGES/gallery/2022 Feast Of Esther in Houston/WhatsApp Image 2024-07-18 at 08.38.57_55bb07c7.jpg';
import feastOfEsther2023Cover from '../Images/FEASTOFESTHERIMAGES/gallery/2023 Feast Of Esther/WhatsApp Image 2024-07-02 at 09.44.48_c4393ed0.jpg';
import nigeriaCover from '../Images/FEASTOFESTHERIMAGES/gallery/2024 Feast  Of Esther in Nigeria/WhatsApp Image 2024-07-09 at 07.19.26_45a389f2.jpg';
import floridaCover from '../Images/FEASTOFESTHERIMAGES/gallery/Feast Of Esther In Florida/WhatsApp Image 2025-04-02 at 03.48.27_0f27676e.jpg';
import hustonTexasCover from '../Images/FEASTOFESTHERIMAGES/gallery/OFFICAL INAUGURATION IN HUSTON TEXAS/20171028_124127.jpg';
import featuredCover from '../Images/FEASTOFESTHERIMAGES/gallery/1.jpg';

// Create importAll function to import images dynamically
function importAll(r) {
  return r.keys().map((item) => {
    const fileName = item.replace('./', '');
    return {
      src: r(item),
      fileName: fileName
    };
  });
}

// Import images from each directory
const inauguralBreakfastImages = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/2017 INAUGURAL BREAKFAST AT FAYETTIEVILLE  NORTH-CAROLINA', false, /\.(png|jpe?g|svg)$/));
const houston2022Images = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/2022 Feast Of Esther in Houston', false, /\.(png|jpe?g|svg)$/));
const feast2023Images = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/2023 Feast Of Esther', false, /\.(png|jpe?g|svg)$/));
const nigeria2024Images = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/2024 Feast  Of Esther in Nigeria', false, /\.(png|jpe?g|svg)$/));
const floridaImages = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/Feast Of Esther In Florida', false, /\.(png|jpe?g|svg)$/));
const houstonInaugurationImages = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery/OFFICAL INAUGURATION IN HUSTON TEXAS', false, /\.(png|jpe?g|svg)$/));

// Import featured images (only files directly in the gallery directory that start with a number)
const featuredImages = importAll(require.context('../Images/FEASTOFESTHERIMAGES/gallery', false, /^\.\/\d+\.jpe?g$/));

// Function to map image array to the expected format with alt text
const mapImagesWithAltText = (images, altPrefix) => {
  return images.map((img, index) => ({
    src: img.src,
    alt: `${altPrefix} - ${index + 1}`
  }));
};

// Define the gallery structure
const galleryStructure = [
  {
    id: 'inaugural-breakfast',
    title: '2017 INAUGURAL BREAKFAST AT FAYETTIEVILLE NORTH-CAROLINA',
    coverImage: inauguralBreakfastCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/2017 INAUGURAL BREAKFAST AT FAYETTIEVILLE  NORTH-CAROLINA',
    images: mapImagesWithAltText(inauguralBreakfastImages, 'Inaugural Breakfast')
  },
  {
    id: 'houston-2022',
    title: '2022 Feast Of Esther in Houston',
    coverImage: houstonCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/2022 Feast Of Esther in Houston',
    images: mapImagesWithAltText(houston2022Images, 'Houston 2022')
  },
  {
    id: 'feast-2023',
    title: '2023 Feast Of Esther',
    coverImage: feastOfEsther2023Cover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/2023 Feast Of Esther',
    images: mapImagesWithAltText(feast2023Images, 'Feast 2023')
  },
  {
    id: 'nigeria-2024',
    title: '2024 Feast Of Esther in Nigeria',
    coverImage: nigeriaCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/2024 Feast  Of Esther in Nigeria',
    images: mapImagesWithAltText(nigeria2024Images, 'Nigeria 2024')
  },
  {
    id: 'florida',
    title: 'Feast Of Esther In Florida',
    coverImage: floridaCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/Feast Of Esther In Florida',
    images: mapImagesWithAltText(floridaImages, 'Florida')
  },
  {
    id: 'houston-inauguration',
    title: 'OFFICIAL INAUGURATION IN HOUSTON TEXAS',
    coverImage: hustonTexasCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery/OFFICAL INAUGURATION IN HUSTON TEXAS',
    images: mapImagesWithAltText(houstonInaugurationImages, 'Houston Inauguration')
  },
  {
    id: 'main-gallery',
    title: 'Featured Images',
    coverImage: featuredCover,
    path: '../Images/FEASTOFESTHERIMAGES/gallery',
    images: mapImagesWithAltText(featuredImages, 'Featured')
  },
];

const Gallery = () => {
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  
  // Handle directory click
  const handleDirectoryClick = (directory) => {
    setSelectedDirectory(directory);
    setCurrentImages(directory.images);
  };
  
  // Handle back to directories
  const handleBackToDirectories = () => {
    setSelectedDirectory(null);
  };
  
  // Open lightbox with specific image
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Photo Gallery</h1>
        <p>Explore moments from our Feast of Esther events</p>
      </div>
      
      <Container>
        {selectedDirectory ? (
          <div className="gallery-images-container">
            <div className="directory-header">
              <button
                className="back-button"
                onClick={handleBackToDirectories}
                aria-label="Back to gallery directories"
              >
                &#8592; Back
              </button>
              <h2>{selectedDirectory.title}</h2>
            </div>
            
            <Row>
              {selectedDirectory.images.map((image, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} className="gallery-item">
                  <div
                    className="gallery-image-container"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${image.alt} in lightbox`}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <span className="view-icon">&#128065;</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Row className="gallery-directories">
            {galleryStructure.map((directory) => (
              <Col key={directory.id} xs={12} sm={6} md={4} className="directory-item">
                <GalleryDirectory
                  directory={directory}
                  onClick={() => handleDirectoryClick(directory)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      
      {lightboxOpen && (
        <Lightbox
          images={currentImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onPrevious={() => setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1))}
          onNext={() => setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1))}
        />
      )}
    </div>
  );
};

export default Gallery;
