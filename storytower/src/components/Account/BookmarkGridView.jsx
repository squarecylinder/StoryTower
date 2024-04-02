// BookmarkGridView.js
import React from 'react';
import RenderStoryItem from '../RenderStoryItems';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './Account.css'; // Import CSS

const BookmarkGridView = ({ bookmarkedStories }) => {

  if (!bookmarkedStories) {
    return <LoadingScreen />
  }

  return (
    <div>
      <h2>My Bookmarks (Grid View)</h2>
      <RenderStoryItem stories={bookmarkedStories} />
    </div>
  );
};

export default BookmarkGridView;
