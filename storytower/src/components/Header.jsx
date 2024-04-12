import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { AuthContext } from '../AuthProvider';

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
    <header className="text-white text-lg bg-primary-950 p-6 justify-center mb-10 flex flex-row flex-wrap gap-12">
        <Link to="/">Home</Link>
        <div onClick={toggleDropdown}>
          Genres
        </div>
        {isDropdownOpen && (
          <div className='bg-primary-950 w-96 divide-y-2 divide-primary-200 z-40 flex flex-row flex-wrap absolute'> 
          {genres.map((genre) => (
            <Link className='text-white text-sm p-2 relative bg-primary-950' key={genre} to={`/comics/genre/${genre}/1`}>
              {genre}
            </Link>
          ))}
          </div>
        )}
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Login</Link>
        {loggedIn && <Link to="/account">Account</Link>}
        {loggedIn && <Link onClick={handleLogOut}>Log Out</Link>}
        <SearchBar />
    </header>
  );
};

export default Header;
