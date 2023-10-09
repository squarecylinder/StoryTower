// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to StoryTower!</h1>
      <Link to="/comics/genre/All/1">Read All Comics</Link>
    </div>
  );
};

export default Home;
