// BookmarkGridView.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './Account.css'; // Import CSS

const BookmarkGridView = ({ bookmarkedStories }) => {

  if (!bookmarkedStories) {
    return <LoadingScreen />
  }

  const renderStoryItem = (item) => (
    <div className='bookmark-item'>
      <img src={item.coverArt} alt="Cover Art" />
      <p>{item.title}</p>
    </div>
  );

  return (
    <div>
      <h2>My Bookmarks (Grid View)</h2>
      <div className='bookmark-grid'>{bookmarkedStories.map((story) => (
        <Link key={story._id} className='bookmark-card' to={`/story/${story._id}`}>{renderStoryItem(story)}</Link>
      ))}</div>
    </div>
  );
};

export default BookmarkGridView;
