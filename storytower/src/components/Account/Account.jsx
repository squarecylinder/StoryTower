// Account.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Profile from './Profile';
import BookmarkListView from './BookmarkListView';
import BookmarkGridView from './BookmarkGridView';
import './Account.css';

const Account = ({isLoggedIn, user}) => {
  const [isGridView, setIsGridView] = useState(false);

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

  if (!isLoggedIn) {
    // Navigate to login page if not logged in
    return <Navigate to="/login" />;
  }

  return (
    <div className="account-container">
      <Profile user={user}/>
      <div className="toggle-view">
        <button onClick={handleViewToggle}>
          {isGridView ? 'Switch to List View' : 'Switch to Grid View'}
        </button>
      </div>
      {isGridView ? <BookmarkGridView bookmarkedStories={user.bookmarkedStories}/> : <BookmarkListView bookmarkedStories={user.bookmarkedStories} />}
    </div>
  );
};

export default Account;
