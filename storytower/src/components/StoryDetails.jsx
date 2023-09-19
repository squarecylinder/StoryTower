import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import client, { GET_CHAPTER_TITLES, GET_STORY } from '../apolloClient';

const StoryDetails = () => {
    const { storyId } = useParams();
    const location = useLocation();
    const [story, setStory] = useState(location.state?.story);
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const fetchStoryDetails = async () => {
            if (!story) {
                try {
                    const { data } = await client.query({
                        query: GET_STORY,
                        variables: { id: storyId }
                    });
                    setStory(data.story);
                } catch (error) {
                    console.error('Error fetching story details:', error.message);
                }
            } else {
                try {
                    const chapterIds = story?.chapters.map(chapter => chapter._id) || [];
                    const { data } = await client.query({
                        query: GET_CHAPTER_TITLES,
                        variables: { chapterIds },
                    });
                    setChapters(data.chapters);
                    console.log('Chapter details:', data); // Adjust this based on the structure of your data
                } catch (error) {
                    console.error('Error fetching chapter details:', error.message);
                }
            }
        };

        fetchStoryDetails();
    }, [story, storyId]);

    useEffect(() => {
        console.log("CHAPTERS", chapters);
    }, [chapters]);

    return (
        <div>
            <h2>Story Details</h2>
            {story && (
                <div>
                    <img
                        src={story.coverArt}
                        alt="Cover Art"
                        className="coverArt"
                    />
                    <p>Title: {story.title}</p>
                    <p>Rating: {story.rating}</p>
                    <p>Last Updated: {story.lastUpdated}</p>
                    <p>Chapter Count: {story.chapterCount}</p>
                    <p>Synopsis: {story.synopsis}</p>
                    <p>Genres: {story.genres.join(', ')}</p>
    
                    {/* Render chapters */}
                    {chapters.length > 0 && (
                        <div>
                            <h3>Chapter Titles</h3>
                            <ul>
                                {chapters.map((chapter, index) => (
                                    <li key={index}>
                                        <Link to={`/chapter/${chapter._id}`}>{chapter.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
};

export default StoryDetails;
