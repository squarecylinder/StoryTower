import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import SearchBar from '../SearchBar/SearchBar';
import { AuthContext } from '../../AuthProvider';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { loggedIn, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogOut = () => {
    logout()
  }

  const genres = [
    "Action",
    "Adventure",
    "All",
    "Another chance",
    "Apocalypse",
    "Crazy MC",
    "Comedy",
    "Cultivation",
    "Demon",
    "Drama",
    "Dungeons",
    "Fantasy",
    "Game",
    "Genius",
    "Genius MC",
    "Harem",
    "Hero",
    "Historical",
    "Isekai",
    "Josei",
    "Magic",
    "Martial Arts",
    "Mature",
    "Monsters",
    "Mystery",
    "Necromancer",
    "Noble",
    "Overpowered",
    "Psychological",
    "Rebirth",
    "Reincarnation",
    "Revenge",
    "Returned",
    "Returner",
    "Romance",
    "School Life",
    "Sci-fi",
    "Seinen",
    "Shounen",
    "Shoujo",
    "Slice of Life",
    "Sports",
    "Superhero",
    "Supernatural",
    "Suspense",
    "System",
    "Thriller",
    "Time Travel",
    "Tower",
    "Tragedy",
    "Video Game",
    "Video Games",
    "Virtual Game",
    "Virtual Reality",
    "Virtual World",
    "Violence",
    "Villain",
    "Webtoon",
    "Wuxia",
    "apocalypse",
    "Return",
  ];

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
        <Link to="/signup">SignUp</Link>
        <Link to="/login">Login</Link>
        {loggedIn && <Link to="/account">Account</Link>}
        {loggedIn && <Link onClick={handleLogOut}>Log Out</Link>}
      </div>
      <div className="search-bar">
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
