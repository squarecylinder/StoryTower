import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import _debounce from 'lodash.debounce'; // Import debounce from lodash
import { SEARCH_STORIES_BY_TITLE } from '../apolloClient'; // Import your query
// import './SearchBar.css'

const SearchBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [getStories, { data }] = useLazyQuery(SEARCH_STORIES_BY_TITLE);

    const debouncedGetStories = _debounce((term) => {
        getStories({ variables: { title: term } });
    }, 300); // 300ms debounce interval
    
    useEffect(() => {
        setSearchTerm(''); // Clear search term when location changes
      }, [location]);

    const handleChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedGetStories(term); // Use the debounced function
    };

    const handleSearch = () => {
        if (data?.searchStoriesByTitle?.length > 0) {
            navigate(`/results/${searchTerm}`, {state: {stories: data.searchStoriesByTitle}});
        }
    };

    return (
        <form onSubmit={e => e.preventDefault()} className='rounded-r-lg border-2 border-primary-600 bg-white'>
            <input
                className='text-black outline-none rounded-l-md'
                type="text"
                placeholder=" Search for a story..."
                value={searchTerm}
                onChange={handleChange}
            />
            <button className='rounded-r-md  border-2 border-primary-700 bg-primary-500  hover:bg-primary-400 hover:text-primary-900 px-2 text-primary-100 shadow-md' onClick={handleSearch}>Search</button>
            {searchTerm && data && data.searchStoriesByTitle && (
                <div className="rounded-b-md border-2 w-60 h-48 overflow-auto absolute bg-primary-500 text-primary-100">
                    {data.searchStoriesByTitle.map((suggestion) => (
                        <Link
                            to={`/story/${suggestion._id}`}
                            state={{ story: suggestion }}
                            key={suggestion._id}
                            className="break-words p-1 block hover:bg-primary-700 hover:text-primary-950"
                        >
                            {suggestion.title.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, index) => (
                                part.toLowerCase() === searchTerm.toLowerCase() ?
                                    <strong key={index}>{part}</strong> :
                                    part
                            ))}
                        </Link>
                    ))}
                </div>
            )}
        </form>
    );
};

export default SearchBar;
