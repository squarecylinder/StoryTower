// LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen animate-pulse">
      <p>Loading... This is being hosted by Render and servers spin down due to inactivity.
      If you are the only person using the site, it may take a few minutes for the server to spin
      up before it can talk to the database. The site is not down! Thank you for your patience!</p>
    </div>
  );
};

export default LoadingScreen;
