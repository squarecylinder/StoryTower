import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './Header/Header';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import ComicIndexPage from './ComicIndexPage/ComicIndexPage';
import StoryDetails from './StoryDetails/StoryDetails';
import ChapterScreen from './ChapterScreen/ChapterScreen';
import Account from './Account/Account';

const App = ({intialLoggedIn, initialUser}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(intialLoggedIn);
  const [user, setUser] = useState(initialUser);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/comics/genre/:genres/:page"
            element={<ComicIndexPage />}
          />
          <Route path="/story/:storyId" element={<StoryDetails isLoggedIn={isLoggedIn} user={user}/>} />
          <Route path="/chapter/:chapterId" element={<ChapterScreen isLoggedIn={isLoggedIn} user={user}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login  setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>} />
          <Route path='/account' element={<Account isLoggedIn={isLoggedIn} user={user}/>} />
        </Routes>
    </Router>
  );
};

export default App;