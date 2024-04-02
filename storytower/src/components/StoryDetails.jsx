import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_STORY, GET_CHAPTER_DETAILS, UPDATE_BOOKMARK } from '../apolloClient';
import { AuthContext } from '../AuthProvider';
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
    const [updateBookmarkStory] = useMutation(UPDATE_BOOKMARK)
    const { loggedIn, user, loading } = useContext(AuthContext);
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
    const [isBookmarked, setIsBookmarked] = useState(user?.bookmarkedStories.findIndex(bookmark => bookmark._id.toString() === storyId) !== -1);


    if (storyLoading || chapterLoading) return <div>Loading...</div>;
    if (storyError) return <div>Error: {storyError.message}</div>;
    if (chapterError) return <div>Error: {chapterError.message}</div>;

    const { story } = storyData;

    const handleBookmarkClick = () => {
        updateBookmarkStory({
            variables: {
                storyId: story._id,
                userId: user._id,
            },
        })
        setIsBookmarked(prevIsBookmarked => !prevIsBookmarked);
    };

    return (
        <div className="story-detailsOLD">
            {story && (
                <div className='flex flex-col flex-wrap items-center'>
                    <img src={story.coverArt} alt="Cover Art" className="cover-artOLD p-3 w-96 h-96 basis-1/6" />
                    <h1 className='basis-1/12'>{story.title}</h1>
                    <p className='basis-1/12'>Rating: {story.rating}</p>
                    <p className='basis-1/12'>Last Updated: {getFormattedDate(story.lastUpdated)}</p>
                    <p className='basis-1/12'>Chapter Count: {story.chapterCount}</p>
                    <p className='basis-1/12'>Synopsis: {story.synopsis}</p>
                    <p className='basis-1/12'>Genres: {story.genres.join(', ')}</p>
                    {loggedIn && !loading && (
                        <button className='rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md' onClick={handleBookmarkClick}>
                            {isBookmarked ? 'Unbookmark' : 'Bookmark'}
                        </button>
                    )}
                    {/* Render chapters */}
                    {chapters.length > 0 && (
                        <div className='mx-auto mb-10'>
                            <div className="chapter-cardsOLD">
                                <div className="chapter-linksOLD flex flex-row justify-between">
                                    <Link to={`/chapter/${chapters[0]._id}`} className="chapter-OLD rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md">
                                        First Chapter
                                    </Link>
                                    <Link to={`/chapter/${chapters[chapters.length - 1]._id}`} className="chapter-cardOLD rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md">
                                        Latest Chapter
                                    </Link>
                                </div>
                                <div className='max-h-80 overflow-auto'>
                                    <ul className='size-full'>
                                        {chapters.map((chapter, index) => (
                                            <li>
                                                <Link key={index} to={`/chapter/${chapter._id}`}>
                                                    <div className='chapter-cardOLD rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md'>
                                                        {chapter.title} {getFormattedDate(chapter.uploaded)}
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoryDetails;
