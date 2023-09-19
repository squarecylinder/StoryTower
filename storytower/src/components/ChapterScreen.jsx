import React from 'react';
import { useLocation } from 'react-router-dom';
import './ChapterScreen.css';

// Replace image URLs with the new domain
const replaceImageUrls = (imageUrls) => {
  const oldDomain = 'https://asura.gg';
  const newDomain = 'https://asuracomics.com';

  return imageUrls.map((url) => url.replace(oldDomain, newDomain));
};

const ChapterScreen = () => {
  const location = useLocation();
  const chapter = location.state;

  // Update chapter images with the new domain
  const updatedImages = chapter?.images ? replaceImageUrls(chapter.images) : [];

  return (
    <div>
      <h2>{chapter?.title}</h2>
      {updatedImages.length > 0 && (
        <div className="chapter-images-container">
          {updatedImages.map((image, index) => (
            <img key={index} src={image} alt={`Chapter Image ${index + 1}`} />
          ))}
        </div>
      )}
      {/* Render other chapter details */}
    </div>
  );
};

export default ChapterScreen;
