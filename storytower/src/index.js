import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import { ApolloProvider } from '@apollo/client';
import './index.css';
import Header from './components/Header';
import Home from './components/Home';
import ComicIndexPage from './components/ComicIndexPage';
import StoryDetails from './components/StoryDetails';
import ChapterScreen from './components/ChapterScreen';
import reportWebVitals from './reportWebVitals';
import client from './apolloClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
      <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/comics/page/:page"
            element={<ComicIndexPage />}
          />
          <Route path="/story/:storyId" element={<StoryDetails />} />
          <Route path="/chapter/:chapterId" element={<ChapterScreen />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
