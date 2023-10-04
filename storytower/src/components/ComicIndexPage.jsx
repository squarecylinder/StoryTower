import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './ComicIndexPage.css';
import client, { GET_STORIES, SEARCH_STORIES_BY_GENRE } from '../apolloClient';
import LoadingScreen from './LoadingScreen';
import debounce from 'lodash.debounce';

const ComicIndexPage = () => {
  const { page, genres }  = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page, 10) || 1); // Ensure currentPage is a number
  const [currentGenre, setCurrentGenre] = useState('all');
  const [totalStories, setTotalStories] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  console.log(currentGenre)
  const debouncedFetchData = debounce(async (page, query) => {
    try {
      if (!loading) {
        setLoading(true);
        const offset = (page - 1) * 24;
        const variables = query === GET_STORIES ? { offset, limit: 24 } : { genres: genres, offset, limit: 24}
        const { data } = await client.query({
          query,
          variables,
        });
        const storyCatalog = data?.getStories|| data?.searchStoriesByGenre
        setFormattedData(storyCatalog.data);
        setTotalStories(storyCatalog.totalStories);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, 500); // Adjust the delay (in milliseconds) as needed
  
  const fetchData = (page) => {
    const query = location.pathname.includes('/all/')
    ? GET_STORIES
    : SEARCH_STORIES_BY_GENRE
    genres != undefined ? setCurrentGenre(genres) : setCurrentGenre('all')
    debouncedFetchData(page, query);
  };

  const renderStoryItem = ({ item }) => (
    <div key={item._id}>
      <img src={item.coverArt} alt="Cover Art" className="coverArt" />
      <p className="itemText">{item.title}</p>
    </div>
  );

  const loadPage = useCallback(
    async (pageNumber) => {
      const lastPage = Math.max(1, Math.ceil(totalStories / 24));
      if (isNaN(pageNumber) || pageNumber < 1) {
        setCurrentPage(1);
      } else if (pageNumber > lastPage) {
        setCurrentPage(lastPage);
      } else {
        fetchData(pageNumber);
        setCurrentPage(pageNumber);
        setIsLastPage(pageNumber === lastPage);
      }
    },
    [totalStories]
  );

  useEffect(() => {
    // Fetch data whenever the page number changes
    fetchData(currentPage);
  }, [currentPage, genres]);

  useEffect(() => {
    // Update the currentPage when the component mounts
    const parsedPage = parseInt(page, 10) || 1;
    setCurrentPage(parsedPage);

    // Fetch data based on the current location
    const newPage = parseInt(location.pathname.split('/').pop(), 10) || 1;
    loadPage(newPage);
  }, [page, genres, loadPage, location]);

  return (
    <div className="contentContainer">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className='container'>
            <div className="grid-container">
              {formattedData.map((item) => (
                <Link to={`/story/${item._id}`} state={{ story: item }} key={item._id}>
                  <div className="item">{renderStoryItem({ item })}</div>
                </Link>
              ))}
            </div>
            <div className="paginationContainer">
              <Link to={`/comics/genre/${currentGenre}/${Math.max(currentPage - 1, 1)}`} disabled={loading}>
                <button
                  className="paginationButton"
                  onClick={() => loadPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </Link>
              <Link to={`/comics/genre/${currentGenre}/${Math.min(currentPage + 1, Math.ceil(totalStories / 24))}`} disabled={loading || isLastPage}>
                <button
                  className="paginationButton"
                  onClick={() => loadPage(Math.min(currentPage + 1, Math.ceil(totalStories / 24)))}
                  disabled={isLastPage}
                >
                  Next
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComicIndexPage;
