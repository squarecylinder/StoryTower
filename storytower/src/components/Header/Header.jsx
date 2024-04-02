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
    <header className="bg-blue-gray-950 h-16 p-2 justify-center mb-10 flex flex-colum flex-no-wrap gap-12">
        <Link className="text-white text-xl" to="/comics/genre/All/1">Home</Link>
        <button className='dropdown-buttonOLD text-white text-xl' onClick={toggleDropdown}>
          Genres
        </button>
        {isDropdownOpen && (
          <div className='dropdown-contentOLD bg-blue-gray-950 w-96 divide-y-2 divide-blue-gray-200 z-40 flex flex-row flex-wrap'> 
          {genres.map((genre) => (
            <Link className='text-white text-sm p-2 bg-blue-gray-950' key={genre} to={`/comics/genre/${genre}/1`}>
              {genre}
            </Link>
          ))}
          </div>
        )}
        <Link className="text-white text-xl"  to="/signup">SignUp</Link>
        <Link className="text-white text-xl"  to="/login">Login</Link>
        {loggedIn && <Link className="text-white text-xl"  to="/account">Account</Link>}
        {loggedIn && <Link className="text-white text-xl"  onClick={handleLogOut}>Log Out</Link>}
        <SearchBar />
    </header>
  );
};

export default Header;
