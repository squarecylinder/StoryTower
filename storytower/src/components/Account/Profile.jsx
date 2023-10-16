// Profile.js
import React from 'react';
import './Account.css'; // Import CSS

const Profile = ({user}) => {
  return (
    <div className="profile-container">
      <div className="profile-picture">{user.profilePicture}</div>
      <div className="username">Username: {user.username}</div>
      <div className="username">Email: {user.email}</div>
    </div>
  );
};

export default Profile;
