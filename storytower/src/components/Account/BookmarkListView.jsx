// BookmarkListView.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './Account.css'; // Import CSS

const BookmarkListView = ({ bookmarkedStories }) => {

  if (!bookmarkedStories) {
    return <LoadingScreen />
  }

  const renderStoryItem = (item) => (
    <div className='bookmark-item'>
      <p>{item.title}</p>
    </div>
  );

  return (
    <div>
      <h2>My Bookmarks (List View)</h2>
      <div className='bookmark-list'>{bookmarkedStories.map((story) => (
        <Link key={story._id} className='bookmark-card' to={`/story/${story._id}`}>{renderStoryItem(story)}</Link>
      ))}</div>
    </div>
  );
};

export default BookmarkListView;
