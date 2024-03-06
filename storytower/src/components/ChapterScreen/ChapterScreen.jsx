import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import './ChapterScreen.css';
import { GET_STORY, GET_CHAPTER_DETAILS } from '../../apolloClient';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
// Replace image URLs with the new domain
const replaceImageUrls = (imageUrls) => {
  const oldDomain = 'https://asura.gg';
  const anotherOldDomain = 'https://www.asurascans.com'
  const anotherAnotherOldDomain = 'https://www.asurascans.com'
  const newOldDomain = 'https://asuracomics.gg';
  const newDomain = 'https://asuratoon.com/';

  return imageUrls.map((url) => {
    //This is actually the biggest mess of all time. Why do they keep changing their domain.
    const replacedURL = url.replace(oldDomain, newDomain)
    const replacedURL2 = url.replace(anotherOldDomain, newDomain)
    const replacedURL3 = url.replace(anotherAnotherOldDomain, newDomain)
    const replacedURL4 = url.replace(newOldDomain, newDomain)
    if (replacedURL !== url) {
      return replacedURL;
    } else if (replacedURL2 !== url) {
      return replacedURL2
    } else if (replacedURL3 !== url) {
      return replacedURL3
    } else if (replacedURL4 !== url) {
      return replacedURL4
    } else return replacedURL
  });
};

const getCurrentChapterIndex = (story, currentChapterId) => {
  if (!story || !story.chapters || !currentChapterId) {
    return -1; // Return -1 if the story or chapters are not available or if currentChapterId is not provided
  }

  // Find the index of the current chapter based on its _id
  const currentIndex = story.chapters.findIndex((chapter) => chapter._id === currentChapterId);

  return currentIndex;
};

const ChapterScreen = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  // Initialize state for story details
  const [previousChapterID, setPreviousChapterID] = useState(null);
  const [isPreviousDisabled, setIsPreviousDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [nextChapterID, setNextChapterID] = useState(null);

  const { loading: chapterLoading, data: { chapters: [chapterData] = [] } = {} } = useQuery(GET_CHAPTER_DETAILS, {
    variables: { chapterIds: chapterId },
    onCompleted: (data) => {
      const storyId = data.chapters[0].story._id;
        getStory({ variables: { id: storyId } });
    },
  });

  const [getStory] = useLazyQuery(GET_STORY, {
    onCompleted: (data) => {
      const currentIndex = getCurrentChapterIndex(data.story, chapterData?._id)
      if (currentIndex !== -1) {
        setPreviousChapterID(data.story.chapters[currentIndex - 1]?._id)
        setNextChapterID(data.story.chapters[currentIndex + 1]?._id)
      }
      setIsPreviousDisabled(!data.story.chapters[currentIndex - 1]?._id)
      setIsNextDisabled(!data.story.chapters[currentIndex + 1]?._id)
    }
  })

  const chapterImages = chapterData?.images

  // Update chapter images with the new domain
  const updatedImages = chapterImages ? replaceImageUrls(chapterImages) : [];

  const goToPreviousChapter = () => {
    if (previousChapterID) navigate(`/chapter/${previousChapterID}`);
  };

  const goToNextChapter = () => {
    if (nextChapterID) navigate(`/chapter/${nextChapterID}`);
  };

  return (
    <div>
      {chapterLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {updatedImages.length > 0 && (
            <div className="chapter-images-container">
              <h2>{chapterData?.title}</h2>
              <div className="chapter-navigation">
                <button disabled={isPreviousDisabled} onClick={goToPreviousChapter}>Previous Chapter</button>
                <button disabled={isNextDisabled} onClick={goToNextChapter}>Next Chapter</button>
              </div>
              {updatedImages.map((image, index) => {
                if(image.includes("asura")){
                <img key={index} src={image} alt={`Chapter Page ${index + 1}`} />
                }
              }
              )}
              <div className="chapter-navigation">
                <button disabled={isPreviousDisabled} onClick={goToPreviousChapter}>Previous Chapter</button>
                <button disabled={isNextDisabled} onClick={goToNextChapter}>Next Chapter</button>
              </div>
            </div>
          )}
        </>
      )
      }
      {/* Render other chapter details */}
    </div>
  );
};

export default ChapterScreen;
