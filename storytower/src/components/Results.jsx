import React from "react";
import { useParams, Link, useLocation} from 'react-router-dom';

// Making this a reusable component for like the index page, genre page, bookmarks
// seems like a good idea

const Results = () =>{
    const location = useLocation();
    const { stories } = location.state
    const hasResults = stories.length > 0 ? true : false

    const renderStoryItem = ({ item }) => (
        <div className="max-w-48" key={item._id}>
          <img className=" max-h-54" src={item.coverArt} alt="Cover Art"/>
          <p>{item.title}</p>
        </div>
      );

    return (
        <div className="pt-6">
            {
            hasResults ? (
                <div className="columns-3xs">
                    {stories.map((item) => 
                        <Link to={`/story/${item._id}`} state={{ story: item }} key={item._id}>
                        <div className="bg-cyan-700 p-4">
                            {renderStoryItem({ item })}
                            </div>
                        </Link>
                            )}
                </div>
            ) : (<> <h1>Oops, looks like there are no results! </h1></>)
            }
        </div>
    )
}

export default Results