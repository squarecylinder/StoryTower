// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='h-[87vh]'>
      <div className='p-4 w-96 mx-auto rounded-md border-2 border-primary-700 shadow-md bg-primary-100'>
        <h1 className='text-xl ml-16 font-semibold m-2 text-primary-900'>Welcome to StoryTower!</h1>
        <p className='text-sm m-auto'>A catalog of manwha, manga, and manhua scrapped from Asura scans and more in the future!
          The point of this website for me, was to have a reliable way to share stories with friends without having to worry if the website was shady.
          This site has basic features currently for viewing stories and saving them as bookmarks in your account. Working on how to rate and comment on stories and chapters.</p>
        <div className='ml-24 mt-4'>
          <Link className='rounded-md border-2 border-primary-700 bg-primary-500  hover:bg-primary-400 hover:text-primary-900 px-4 py-2 text-primary-100 shadow-md' to="/comics/genre/All/1">Read All Comics</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
