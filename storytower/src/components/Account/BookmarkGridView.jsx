// BookmarkGridView.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './Account.css'; // Import CSS

const BookmarkGridView = ({bookmarkedStories}) => {

  if(!bookmarkedStories){
    return <LoadingScreen />
  }

  const renderStoryItem = (item) => (
    <div key={item._id}>
      <img src={item.coverArt} alt="Cover Art" />
      <p>{item.title}</p>
    </div>
  );

  // console.log(bookmarkedStories)
  return (
    <div>
      <h2>My Bookmarks (Grid View)</h2>
      <div>{bookmarkedStories.map((story) => (
        <Link to={`/story/${story._id}`}>{renderStoryItem(story)}</Link>
      ))}</div>
    </div>
  );
};

export default BookmarkGridView;
