import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css'
import client, { GET_STORIES } from './apolloClient';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState([]);

  const fetchData = async (page = 1) => {
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
    const containerRef = useRef(null);
    console.log(data)
    // This is to resize the items on the page so they fit nicely depending on screensize.
    useEffect(() => {
      const updateGridColumns = () => {
        const containerWidth = containerRef.current.offsetWidth;
        const numColumns = Math.floor(containerWidth / 220); // Adjust 220 based on your design
        containerRef.current.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
      };

      window.addEventListener('resize', updateGridColumns);
      updateGridColumns();

      return () => {
        window.removeEventListener('resize', updateGridColumns);
      };
    }, []);

    return (
      <div className="grid-container" ref={containerRef}>
        {data.map((item) => (
          <Link to={`story/${item._id}`} state={{ story: item }} >
            <div key={item._id} className="item">
              {renderItem({ item })}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchData(1)
  }, [])

  return (
    <div className="container">
      <div className="contentContainer">
        <StoryList data={formattedData} renderItem={renderStoryItem} />
      </div>
    </div>
  );
};

export default App;
