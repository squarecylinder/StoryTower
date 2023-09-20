import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './App.css';
import client, { GET_STORIES } from './apolloClient';
import LoadingScreen from './components/LoadingScreen';

const ComicPage = () => {
  const { page } = useParams()
  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchTotalStories = async () => {
    try {
      const { data } = await client.query({
        query: GET_STORIES,
        variables: { offset: 0, limit: 1 },
      });
      return data.getStories.totalStories;
    } catch (error) {
      console.error('Error fetching total stories:', error.message);
      return 0;
    }
  };

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const offset = (page - 1) * 24;
      const { data } = await client.query({
        query: GET_STORIES,
        variables: { offset, limit: 24 },
      });
      setFormattedData(data.getStories.data);
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

  useEffect(() => {
    const loadPage = async () => {
      const totalStories = await fetchTotalStories();
      const lastPage = Math.max(1, Math.ceil(totalStories / 24));

      if (isNaN(currentPage) || currentPage < 1) {
        // Redirect to the first page
        setCurrentPage(1);
      } else if (currentPage > lastPage) {
        // Redirect to the last available page
        setCurrentPage(lastPage);
      } else {
        fetchData(currentPage);
      }
    };

    loadPage();
  }, [currentPage]);

  return (
    <div className="container">
      <div className="contentContainer">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="grid-container">
              {formattedData.map((item) => (
                <Link to={`/story/${item._id}`} state={{ story: item }} key={item._id}>
                  <div className="item">{renderStoryItem({ item })}</div>
                </Link>
              ))}
            </div>
            <div className="pagination">
              <Link to={`/comics/page/${currentPage - 1}`} disabled={currentPage === 1}>
                <button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </button>
              </Link>
              <Link to={`/comics/page/${currentPage + 1}`} disabled={loading}>
                <button onClick={() => setCurrentPage(prevPage => prevPage + 1)}>
                  Next
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComicPage;
