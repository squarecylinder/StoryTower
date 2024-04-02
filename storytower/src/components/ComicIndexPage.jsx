import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
// import "./ComicIndexPage.css";
import { GET_STORIES, SEARCH_STORIES_BY_GENRE } from "../apolloClient";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
import RenderStoryItem from "./RenderStoryItems";

const ComicIndexPage = () => {
  const limit = 28;
  const navigate = useNavigate();
  const { page, genres } = useParams();
  const { loading, error, data } = useQuery(
    genres === "All" ? GET_STORIES : SEARCH_STORIES_BY_GENRE,
    {
      variables: {
        genres: genres,
        offset: (page - 1) * limit,
        limit: limit,
      },
    }
  );
  const totalStories =
    data?.getStories?.totalStories || data?.searchStoriesByGenre?.totalStories;
  const formattedData =
    data?.getStories?.data || data?.searchStoriesByGenre?.data;

  useEffect(() => {
    if (
      isNaN(page) ||
      page < 1 ||
      (totalStories && page > Math.ceil(totalStories / limit))
    ) {
      const validPage = totalStories ? Math.ceil(totalStories / limit) : 1;
      navigate(`/comics/genre/${genres}/${validPage}`);
    }
  }, [page, navigate, genres, totalStories]);

  if (error) return <p>{error}</p>;

  return (
    <div className="contentContainer">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <RenderStoryItem stories={formattedData} />
          <div className="paginationContainerOLD p-2 space-x-1">
            <Link to={`/comics/genre/${genres}/${Math.max(page - 1, 1)}`}>
              <button
                className='rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md'
                disabled={loading || parseInt(page) === 1}
              >
                Previous
              </button>
            </Link>
            <Link
              to={`/comics/genre/${genres}/${Math.min(
                parseInt(page) + 1,
                Math.ceil(totalStories / limit)
              )}
              `}
            >
              <button
                className='rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md'
                disabled={loading || parseInt(page) === totalStories / limit}
              >
                Next
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ComicIndexPage;
