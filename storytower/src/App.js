import logo from './logo.svg';
import './App.css';
import {useQuery} from '@apollo/client';
import client, { GET_STORIES }  from './apolloClient';

client.query(GET_STORIES).then((results) => console.log(results));

function DisplayStories() {
  const { loading, error, data } = useQuery(GET_STORIES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log(data);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {/* <DisplayStories /> */}
    </div>
  );
}

export default App;
