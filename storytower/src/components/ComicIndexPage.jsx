import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import './ComicIndexPage.css';
import { GET_STORIES, SEARCH_STORIES_BY_GENRE } from '../apolloClient';
import LoadingScreen from './LoadingScreen';

const ComicIndexPage = () => {
  const navigate = useNavigate()
  const { page, genres } = useParams();
  const { loading, error, data } = useQuery(genres == 'all' ? GET_STORIES : SEARCH_STORIES_BY_GENRE, {
    variables: {
      genres: genres || '',
      offset: (page - 1) * 24,
      limit: 24
    }
  });
  const totalStories = data?.getStories?.totalStories || data?.searchStoriesByGenre?.totalStories
  const formattedData = data?.getStories?.data || data?.searchStoriesByGenre?.data

  useEffect(() => {
    if(isNaN(page) || page < 1 || (totalStories && page > Math.ceil(totalStories / 24))) {
      console.log(page, ' is the page')
      const validPage = totalStories ? Math.ceil(totalStories / 24) : 1;
      navigate(`/comics/genre/${genres}/${validPage}`)
    }
  },[page, navigate, genres, totalStories])


  const renderStoryItem = ({ item }) => (
    <div key={item._id}>
      <img src={item.coverArt} alt="Cover Art" className="coverArt" />
      <p className="itemText">{item.title}</p>
    </div>
  );

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
              <Link to={`/comics/genre/${genres}/${Math.max(page - 1, 1)}`} disabled={loading || parseInt(page) === 1}>
                <button
                  className="paginationButton"
                >
                  Previous
                </button>
              </Link>
              <Link to={`/comics/genre/${genres}/${Math.min(parseInt(page) + 1, Math.ceil(totalStories / 24))}
              `} disabled={loading}>
                <button
                  className="paginationButton"
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
