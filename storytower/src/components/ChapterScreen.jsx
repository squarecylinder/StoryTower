import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import './ChapterScreen.css';
import { GET_STORY, GET_CHAPTER_DETAILS } from '../apolloClient';

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
  const [story, setStory] = useState(null);
  const [previousChapterID, setPreviousChapterID] = useState(null);
  const [isPreviousDisabled, setIsPreviousDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [nextChapterID, setNextChapterID] = useState(null);

  const [getChapter, { data: { chapters: [chapterData] = [] } = {}, loading: chapterLoading }] = useLazyQuery(GET_CHAPTER_DETAILS, {
    variables: { chapterIds: [chapterId] }
  });
  

  const [getStory] = useLazyQuery(GET_STORY, {
    variables: { id: chapterData?.story?._id },
    onCompleted: (data) => {
      setStory(data.story);
    },
  });

  useEffect(() => {
    // Fetch chapter details when component mounts or chapter changes
    getChapter();
  }, [getChapter, chapterId]);

  useEffect(() => {
    // Update chapterInformation when chapterData changes
    if (!chapterLoading && chapterData) {
      getStory()
    }
  }, [chapterData, chapterLoading, getStory]);



  useEffect(() => {
    if(!chapterLoading){
    const currentIndex = getCurrentChapterIndex(story, chapterData?._id);

    if (currentIndex !== -1) {
      setPreviousChapterID(story.chapters[currentIndex - 1]?._id)
      setNextChapterID(story.chapters[currentIndex + 1]?._id)
    }
    setIsPreviousDisabled(previousChapterID ? false : true)
    setIsNextDisabled(nextChapterID ? false : true)
  }
  }, [chapterLoading, chapterData?._id, story, isNextDisabled, isPreviousDisabled, nextChapterID, previousChapterID]);


  // Update chapter images with the new domain
  const updatedImages = chapterData?.images ? replaceImageUrls(chapterData.images) : [];

  const goToPreviousChapter = () => {
    if(previousChapterID) navigate(`/chapter/${previousChapterID}`);
  };

  const goToNextChapter = () => {
    if(nextChapterID) navigate(`/chapter/${nextChapterID}`);
  };

  return (
    <div>
      {updatedImages.length > 0 && (
        <div className="chapter-images-container">
      <h2>{chapterData?.title}</h2>
          <div className="chapter-navigation">
            <button disabled={isPreviousDisabled} onClick={goToPreviousChapter}>Previous Chapter</button>
            <button disabled={isNextDisabled} onClick={goToNextChapter}>Next Chapter</button>
          </div>
          {updatedImages.map((image, index) => (
            <img key={index} src={image} alt={`Chapter Page ${index + 1}`} />
          ))}
          <div className="chapter-navigation">
            <button disabled={isPreviousDisabled} onClick={goToPreviousChapter}>Previous Chapter</button>
            <button disabled={isNextDisabled} onClick={goToNextChapter}>Next Chapter</button>
          </div>
        </div>
      )}
      {/* Render other chapter details */}
    </div>
  );
};

export default ChapterScreen;
