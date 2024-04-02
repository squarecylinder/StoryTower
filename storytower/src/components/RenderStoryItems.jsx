import React from "react";

import { Link } from "react-router-dom";

const RenderStoryItem = ({stories}) => {

  const renderStoryCard = ({ item }) => (
    <div key={item._id}>
      <img className="aspect-square h-96" src={item.coverArt} alt="Cover Art" />
      <p>{item.title}</p>
    </div>
  );

  return (
    <div className="p-2 flex flex-wrap flex-row gap-2 justify-center items-center h-fit">
      {stories.map((item) => (
        <Link to={`/story/${item._id}`} state={{ story: item }} key={item._id}>
          <div className="bg-cyan-700 p-2 max-w-64 block break-words text-blue-gray-100">
            {renderStoryCard({ item })}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RenderStoryItem;
