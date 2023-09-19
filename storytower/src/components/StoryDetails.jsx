import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import client, { GET_CHAPTER_TITLES, GET_STORY } from '../apolloClient';

const StoryDetails = () => {
  const { storyId } = useParams();
  const location = useLocation();
  const story = location.state?.story
  const storyChapters = story?.chapters || [];
  const storyChapterIds = storyChapters.map(chapter => chapter._id)
  console.log(storyId)

  useEffect(() => {
    const fetchStoryDetails = async () => {
    if(!story){
        try {
            const { data } = await client.query({
                query: GET_STORY,
                variables: { _id: storyId}
            })
            console.log('Story details from URL Params: ', data)
        } catch (error) {
            console.error('Error fetching story details:', error.message);
        }
    }
      try {
        const { data } = await client.query({
          query: GET_CHAPTER_TITLES,
          variables: { _id: storyId, chapterIds: storyChapterIds }, // Replace with actual chapterIds
        });
        console.log('Story details:', data); // Adjust this based on the structure of your data
      } catch (error) {
        console.error('Error fetching story details:', error.message);
      }
    };

    fetchStoryDetails();
  }, [storyId]);

  return (
    <div>
      <h2>Story Details</h2>
      <p>ID: {storyId}</p>
      {/* Add other details here */}
    </div>
  );
};

export default StoryDetails;
