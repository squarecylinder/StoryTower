import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Implement debouncing to delay the search until the user pauses typing
    const timeoutId = setTimeout(() => {
      // Fetch suggestions based on the searchTerm from the server
      // Update the suggestions state
      // Example fetch call:
      // fetchSuggestionsFromServer(searchTerm).then((data) => setSuggestions(data));
    }, 300); // Adjust the delay as needed

    // Clear the timeout on component cleanup
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            {/* Highlight the matching part of the suggestion */}
            {suggestion.title.replace(
              new RegExp(searchTerm, 'gi'),
              (match) => `<strong>${match}</strong>`
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
