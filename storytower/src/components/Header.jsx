import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import SearchBar from './SearchBar';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const genres = [
      "Psychological",
      "Tragedy",
      "Wuxia",
      "Virtual World",
      "Supernatural",
      "Returned",
      "Virtual Game",
      "Adaptation",
      "Cultivation",
      "Seinen",
      "Mystery",
      "Magic",
      "Another chance",
      "Mature",
      "Historical",
      "Sci-fi",
      "Drama",
      "Isekai",
      "Discord",
      "Martial Arts",
      "Romance",
      "Overpowered",
      "Sports",
      "Suspense",
      "apocalypse",
      "Genius",
      "Regression",
      "Josei",
      "Shoujo",
      "Comedy",
      "Murim",
      "Crazy MC",
      "Return",
      "Hero",
      "Returner",
      "Necromancer",
      "Dungeons",
      "Shounen",
      "System",
      "Video Games",
      "Action",
      "Thriller",
      "Revenge",
      "Monsters",
      "Slice of Life",
      "Harem",
      "Webtoon",
      "School Life",
      "Time Travel",
      "Noble",
      "tower",
      "Video Game",
      "Violence",
      "Demon",
      "Villain",
      "Genius MC",
      "Superhero",
      "Reincarnation",
      "Rebirth",
      "Virtual Reality",
      "Fantasy",
      "Adventure",
      "Game",
    ]

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
        <Link to="#">Tab 1</Link>
        <Link to="#">Tab 2</Link>
      </div>
      <div className="search-bar">
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
