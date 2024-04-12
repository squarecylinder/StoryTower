import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './Header';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Results from './Results'
import ComicIndexPage from './ComicIndexPage';
import StoryDetails from './StoryDetails';
import ChapterScreen from './ChapterScreen/ChapterScreen';
import Account from './Account/Account';

const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/comics/genre/:genres/:page"
            element={<ComicIndexPage />}
          />
          <Route path="/story/:storyId" element={<StoryDetails/>} />
          <Route path="/chapter/:chapterId" element={<ChapterScreen/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login/>} />
          <Route path='/account' element={<Account/>} />
          <Route path='/results/:search' element={<Results/>} />
        </Routes>
    </Router>
  );
};

export default App;