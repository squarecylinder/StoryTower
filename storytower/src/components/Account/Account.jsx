// Account.js
import React, { useContext, useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import BookmarkListView from "./BookmarkListView";
import BookmarkGridView from "./BookmarkGridView";
import { AuthContext } from "../../AuthProvider";
import "./Account.css";

const Account = () => {
  const { loggedIn, user, loading } = useContext(AuthContext);
  const [isGridView, setIsGridView] = useState(true);

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!loggedIn && !user && !loading) {
    return <p> User is not logged in!</p>;
  }

  return (
    <div className="account-containerOLD bg-slate-200 p-10 flex flex-col justify-center items-center">
      <div className="profile-containerOLD p-4 border-2 border-blue-gray-950 rounded-md max-w-96 mb-4">
        <img
          className="bg-blue-gray-950 rounded-full w-20 h-20 mx-auto"
          src={user.profilePicture}
        />
        <p>
          <span className="text-xl">Username:</span> {user.username}
        </p>
        <p>
          <span className="text-xl">Email:</span> {user.email}
        </p>
        <button
          onClick={() => alert("I don't do anything yet")}
          className="mx-auto items-center w-full rounded-md border-2 border-blue-gray-700 bg-blue-gray-500 hover:bg-blue-gray-400 hover:text-blue-gray-900 p-1 text-blue-gray-100 shadow-md hover:shadow-inner"
        >
          EDIT USER
        </button>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="rounded-md border-2 border-blue-gray-700 bg-blue-gray-500  hover:bg-blue-gray-400 hover:text-blue-gray-900 px-4 py-2 text-blue-gray-100 shadow-md hover:shadow-inner"
          onClick={handleViewToggle}
        >
          {isGridView ? "Switch to List View" : "Switch to Grid View"}
        </button>
        {isGridView ? (
          <BookmarkGridView bookmarkedStories={user?.bookmarkedStories} />
        ) : (
          <BookmarkListView bookmarkedStories={user?.bookmarkedStories} />
        )}
      </div>
    </div>
  );
};

export default Account;
