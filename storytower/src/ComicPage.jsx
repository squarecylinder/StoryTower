import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './App.css';
import client, { GET_STORIES } from './apolloClient';
import LoadingScreen from './components/LoadingScreen';

const ComicPage = () => {
  const { page } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page, 10) || 1); // Ensure currentPage is a number
  const [totalStories, setTotalStories] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  
  const fetchData = async (page) => {
    console.log("TEST")
    try {
      if (!loading) {
        setLoading(true);
        const offset = (page - 1) * 24;
        const { data } = await client.query({
          query: GET_STORIES,
          variables: { offset, limit: 24 },
        });
        setFormattedData(data.getStories.data);
        setTotalStories(data.getStories.totalStories);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
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
  }, [currentPage]);

  useEffect(() => {
    // Update the currentPage when the component mounts
    const parsedPage = parseInt(page, 10) || 1;
    setCurrentPage(parsedPage);

    // Fetch data based on the current location
    const newPage = parseInt(location.pathname.split('/').pop(), 10) || 1;
    loadPage(newPage);
  }, [page, loadPage, location]);

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
            <div className="pagination">
              <Link to={`/comics/page/${Math.max(currentPage - 1, 1)}`} disabled={loading}>
                <button
                  onClick={() => loadPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </Link>
              <Link to={`/comics/page/${Math.min(currentPage + 1, Math.ceil(totalStories / 24))}`} disabled={loading || isLastPage}>
                <button
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

export default ComicPage;
