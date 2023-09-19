import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css'
import client, { GET_STORIES } from './apolloClient';
import LoadingScreen from './components/LoadingScreen'; 

const App = () => {
  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const offset = (page - 1) * 24;
      const { data } = await client.query({
        query: GET_STORIES,
        variables: { offset, limit: 24 },
      });
      setFormattedData(data.getStories.data)
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStoryItem = ({ item }) => (
    <div key={item._id}>
      <img
        src={item.coverArt}
        alt="Cover Art"
        className="coverArt"
      />
      <p className="itemText">{item.title}</p>
    </div>
  );

  const StoryList = ({ data, renderItem }) => {
    return (
      <div className="grid-container">
        {data.map((item) => (
          <Link to={`story/${item._id}`} state={{ story: item }} key={item._id}>
            <div className="item">{renderItem({ item })}</div>
          </Link>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
    fetchData(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      fetchData(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <div className="contentContainer">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <StoryList data={formattedData} renderItem={renderStoryItem} />
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <button onClick={handleNextPage} disabled={loading}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
