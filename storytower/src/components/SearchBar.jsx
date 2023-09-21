import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import _debounce from 'lodash.debounce'; // Import debounce from lodash
import { SEARCH_STORIES_BY_TITLE } from '../apolloClient'; // Import your query
import './SearchBar.css'

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
        // Handle the search logic, e.g., navigate to the appropriate page
        // In this example, we're just navigating to the first story if available
        if (data?.searchStoriesByTitle?.length > 0) {
            navigate(`/story/${data.searchStoriesByTitle[0]._id}`);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for a story..."
                value={searchTerm}
                onChange={handleChange}
            />
            <button onClick={handleSearch}>Search</button>
            {searchTerm && data && data.searchStoriesByTitle && (
                <div className="suggestions">
                    {data.searchStoriesByTitle.map((suggestion) => (
                        <Link
                            to={`/story/${suggestion._id}`}
                            state={{ story: suggestion }}
                            key={suggestion._id}
                            className="suggestion-item"
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
        </div>
    );
};

export default SearchBar;
