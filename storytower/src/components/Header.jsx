import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import SearchBar from './SearchBar';

const Header = () => {
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
