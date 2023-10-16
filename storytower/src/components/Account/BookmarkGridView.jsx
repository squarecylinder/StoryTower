// BookmarkGridView.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './Account.css'; // Import CSS

const BookmarkGridView = ({bookmarkedStories}) => {

  if(!bookmarkedStories){
    return <LoadingScreen />
  }

  const renderStoryItem = ({ item }) => (
    console.log(item)
    // <div key={item._id}>
    //   <img src={item.coverArt} alt="Cover Art" className="coverArt" />
    //   <p className="itemText">{item.title}</p>
    // </div>
  );

  console.log(bookmarkedStories)
  return (
    <div>
      <h2>My Bookmarks (Grid View)</h2>
      <div>{bookmarkedStories.map((story) => (
        <Link to={`/story/${story._id}`}>{story.coverArt}</Link>
      ))}</div>
    </div>
  );
};

export default BookmarkGridView;
