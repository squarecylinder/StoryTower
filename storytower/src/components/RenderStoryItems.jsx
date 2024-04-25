import React from "react";

import { Link } from "react-router-dom";

const RenderStoryItem = ({stories}) => {
    console.log(stories);

  const renderStoryCard = ({ item }) => (
    <div>
      <img className="aspect-square h-96" src={item.coverArt} alt="Cover Art" />
      <p>{item.title}</p>
    </div>
  );

  return (
    <div className="columns-2 md:flex flex-wrap justify-center">
      {stories.map((item) => (
        <Link to={`/story/${item._id}`} state={{ story: item }} key={item._id}>
          <div className="bg-primary-700 p-2 max-w-64 block break-words text-primary-100">
            {renderStoryCard({ item })}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RenderStoryItem;
