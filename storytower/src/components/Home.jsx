// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to StoryTower!</h1>
      <p>A catalog of manwha, manga, and manhua scrapped from Asura scans and more in the future!</p>
      <p>The point of this website for me, was to have a reliable way to share stories with friends without having to worry if the website was shady.</p>
      <p>This site has basic features currently for viewing stories and saving them as bookmarks in your account. Working on how to rate and comment on stories and chapters.</p>
      <Link to="/comics/genre/All/1">Read All Comics</Link>
    </div>
  );
};

export default Home;
