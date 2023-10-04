import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import SearchBar from './SearchBar';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const genres = ['Action', 'Adventure', 'Fantasy', 'Isekai', 'Shounen', 'Supernatural', 'Necromancer', 'Returner', 'Martial Arts', 'Muriem', 'Genius MC', 'Drama', 'Comedy', 'School Life', 'Video Games', 'Virtual Reality', 'Regression']

  return (
    <div className="header">
      <div className="logo">
        <Link to="/comics/page/1">Home</Link>
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
