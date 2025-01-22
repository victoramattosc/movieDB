import { DatabaseProvider } from './DatabaseProvider';
import { MovieList } from './MovieList';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
    <div className="App">
      <h1>Movie Database</h1>
      <MovieList />
    </div>
  </DatabaseProvider>
  );
}

export default App;
