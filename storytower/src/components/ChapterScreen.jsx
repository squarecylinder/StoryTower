import React from 'react';
import { useLocation } from 'react-router-dom';
import './ChapterScreen.css';

// Replace image URLs with the new domain
const replaceImageUrls = (imageUrls) => {
  const oldDomain = 'https://asura.gg';
  const anotherOldDomain = 'https://www.asurascans.com'
  const newDomain = 'https://asuracomics.com';

  return imageUrls.map((url) => {
    const replacedURL = url.replace(oldDomain, newDomain)
    const replacedURL2 = url.replace(anotherOldDomain, newDomain)
    if (replacedURL !== url) {
      return replacedURL;
    } else if (replacedURL2 !== url) {
      return replacedURL2
    } else return replacedURL
  });
};

const ChapterScreen = () => {
  const location = useLocation();
  const chapter = location.state;

  // Update chapter images with the new domain
  const updatedImages = chapter?.images ? replaceImageUrls(chapter.images) : [];

  const goToPreviousChapter = () => {
    // Implement logic to navigate to the previous chapter
    // Example: navigate(`/chapter/${previousChapterId}`);
  };

  const goToNextChapter = () => {
    // Implement logic to navigate to the next chapter
    // Example: navigate(`/chapter/${nextChapterId}`);
  };


  return (
    <div>
      {updatedImages.length > 0 && (
        <div className="chapter-images-container">
      <h2>{chapter?.title}</h2>
          <div className="chapter-navigation">
            <button onClick={goToPreviousChapter}>Previous Chapter</button>
            <button onClick={goToNextChapter}>Next Chapter</button>
          </div>
          {updatedImages.map((image, index) => (
            <img key={index} src={image} alt={`Chapter Page ${index + 1}`} />
          ))}
          <div className="chapter-navigation">
            <button onClick={goToPreviousChapter}>Previous Chapter</button>
            <button onClick={goToNextChapter}>Next Chapter</button>
          </div>
        </div>
      )}
      {/* Render other chapter details */}
    </div>
  );
};

export default ChapterScreen;
