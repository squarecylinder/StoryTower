import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_STORY, GET_CHAPTER_DETAILS } from '../../apolloClient';
import './StoryDetails.css';

const getFormattedDate = (lastUpdated) => {
    const formattedDate = new Date(parseInt(lastUpdated)).toISOString();
    const [year, month, day] = formattedDate.split('T')[0].split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[parseInt(month) - 1]; // Adjust for 0-based index
    return `${monthName} ${day}, ${year}`;
  };

const StoryDetails = () => {
    const { storyId } = useParams();
    const { loading: storyLoading, error: storyError, data: storyData } = useQuery(GET_STORY, {
        variables: { id: storyId },
    });

    const [chapters, setChapters] = useState([]);
    const { loading: chapterLoading, error: chapterError, data: chapterData } = useQuery(GET_CHAPTER_DETAILS, {
        variables: { chapterIds: storyData?.story?.chapters.map(chapter => chapter._id) || [] },
        onCompleted: () => {
            setChapters(chapterData.chapters)
        }
    });

    if (storyLoading || chapterLoading) return <div>Loading...</div>;
    if (storyError) return <div>Error: {storyError.message}</div>;
    if (chapterError) return <div>Error: {chapterError.message}</div>;

    const { story } = storyData;

    return (
        <div className="story-details">
            {story && (
                <div>
                    <h2>{story.title}</h2>
                    <img src={story.coverArt} alt="Cover Art" className="cover-art" />
                    <p>Rating: {story.rating}</p>
                    <p>Last Updated: {getFormattedDate(story.lastUpdated)}</p>
                    <p>Chapter Count: {story.chapterCount}</p>
                    <p>Synopsis: {story.synopsis}</p>
                    <p>Genres: {story.genres.join(', ')}</p>

                    {/* Render chapters */}
                    {chapters.length > 0 && (
                        <div>
                            <h3>Chapter Titles</h3>
                            <div className="chapter-cards">
                                <div className="chapter-links">
                                    <Link to={`/chapter/${chapters[0]._id}`}className="chapter-card">
                                        First Chapter
                                    </Link>
                                    <Link to={`/chapter/${chapters[chapters.length - 1]._id}`} className="chapter-card">
                                        Latest Chapter
                                    </Link>
                                </div>
                                {chapters.map((chapter, index) => (
                                    <Link to={`/chapter/${chapter._id}`}>
                                        <div key={index} className='chapter-card'>
                                            {chapter.title} {getFormattedDate(chapter.uploaded)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoryDetails;
