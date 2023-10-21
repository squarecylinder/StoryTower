// Account.js
import React, { useContext, useState } from 'react';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import Profile from './Profile';
import BookmarkListView from './BookmarkListView';
import BookmarkGridView from './BookmarkGridView';
import  { AuthContext } from '../../AuthProvider';
import './Account.css';

const Account = () => {
  const { loggedIn, user, loading } = useContext(AuthContext);
  const [isGridView, setIsGridView] = useState(false);

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };
  
  if(loading){
    return <LoadingScreen />
  }

  if (!loggedIn && !user && !loading) {
    return <p> User is not logged in!</p>
  }

  return (
    <div className="account-container">
      <Profile user={user}/>
      <div className="toggle-view">
        <button onClick={handleViewToggle}>
          {isGridView ? 'Switch to List View' : 'Switch to Grid View'}
        </button>
      </div>
      {isGridView ? <BookmarkGridView bookmarkedStories={user?.bookmarkedStories}/> : <BookmarkListView bookmarkedStories={user?.bookmarkedStories} />}
    </div>
  );
};

export default Account;
