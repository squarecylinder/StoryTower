import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import SearchBar from './SearchBar';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  // Not a comprehensive list of genres. I don't know how to better check this, I was thinking of using a mongodb query that finds all the unique values that are in the genres field of a bunch of different stories maybe?

  const genres = ['All', 'Action', 'Adventure', 'Fantasy', 'Isekai', 'Shounen', 'Supernatural', 'Necromancer', 'Returner', 'Martial Arts', 'Murim', 'Genius MC', 'Drama', 'Comedy', 'School Life', 'Video Games', 'Virtual Reality', 'Regression']

  return (
    <div className="header">
      <div className="logo">
        <Link to="/comics/genre/All/1">Home</Link>
      </div>
      <div className='dropdown'>
        <div className='dropdown-button' onClick={toggleDropdown}>
          Genres
        </div>
        {isDropdownOpen && (
          <div className='dropdown-content'> 
          {genres.map((genre) => (
            <Link key={genre} to={`/comics/genre/${genre}/1`}>
              {genre}
            </Link>
          ))}
          </div>
        )}
      </div>
      <div className="placeholder-tabs">
        {/* Placeholder tabs */}
        <Link to="#">Tab 1</Link>
        <Link to="#">Tab 2</Link>
      </div>
      <div className="search-bar">
        {/* Your search bar JSX goes here */}
        {/* <input type="text" placeholder="Search" /> */}
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
