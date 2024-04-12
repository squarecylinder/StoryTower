import React from "react";
import { Link, useLocation } from "react-router-dom";
import RenderStoryItem from "./RenderStoryItems";
// Making this a reusable component for like the index page, genre page, bookmarks
// seems like a good idea

const Results = () => {
  const location = useLocation();
  const { stories } = location.state ?? {};
  const hasResults = stories?.length > 0 ? true : false;

  return (
    <div className="p-6">
      {hasResults ? (
        <RenderStoryItem stories={stories} />
      ) : (
        <h1 className="text-xl">Oops, looks like there are no results! </h1>
      )}
    </div>
  );
};

export default Results;
