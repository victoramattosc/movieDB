// DatabaseProvider.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from './db';
import { addRxPlugin } from 'rxdb';

// Importando os plugins necessários
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';

// Adicionando os plugins
addRxPlugin(RxDBQueryBuilderPlugin);

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription = null;

    (async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        await fetchMovies(database); // Carrega os filmes na inicialização
        setupWebSocket(database);

        // Subscribing to changes in the movies collection
        const query = database.movies.find().sort({ name: 1 });
        subscription = query.$.subscribe({
          next: (result) => {
            setMovies(result);
            setIsLoading(false);
          },
          error: (err) => {
            console.error('RxDB subscription error:', err);
            setError(err.message);
            setIsLoading(false);
          },
        });
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err.message);
        setIsLoading(false);
      }
    })();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const fetchMovies = async (database) => {
    try {
      const response = await fetch('http://localhost:8000/api/movies/');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      // Converte o ID para string para garantir compatibilidade com o esquema
      const sanitizedData = data.map((movie) => ({
        ...movie,
        id: String(movie.id), // Converte id para string
      }));

      const moviesCollection = database.movies;
      await moviesCollection.bulkUpsert(sanitizedData); // Use bulkUpsert
      console.log('Movies fetched and upserted into RxDB');
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message);
    }
  };

  const setupWebSocket = (database) => {
    const ws = new WebSocket('ws://localhost:8001/ws/movies/');
  
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    ws.onmessage = async (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);
      const { action, movie, movie_id } = data;
    
      const moviesCollection = database.movies;
    
      if (action === 'create' || action === 'update') {
        const sanitizedMovie = {
          ...movie,
          id: String(movie.id),
        };
        console.log('Upserting movie:', sanitizedMovie);
        await moviesCollection.upsert(sanitizedMovie);
      } else if (action === 'delete') {
        console.log('Deleting movie with ID:', movie_id);
    
        const doc = await moviesCollection.findOne().where('id').eq(String(movie_id)).exec();
        if (doc && !doc._deleted) {
          try {
            await doc.remove();
            console.log(`Movie with ID ${movie_id} deleted successfully via WebSocket.`);
          } catch (error) {
            if (error.rxdb && error.parameters && error.parameters.writeError) {
              console.warn('Conflict detected. Skipping redundant deletion attempt.');
            } else {
              console.error(`Error deleting movie with ID ${movie_id}:`, error);
            }
          }
        } else {
          console.warn(`Movie with ID ${movie_id} is already deleted or not found.`);
        }
      }
    };
    
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };
  
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };
  

  const createMovie = async (newMovie) => {
    try {
      const response = await fetch('http://localhost:8000/api/movies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create movie');
      }
      const createdMovie = await response.json();

      // Garante que o ID seja string
      const sanitizedMovie = { ...createdMovie, id: String(createdMovie.id) };

      const moviesCollection = db.movies;
      await moviesCollection.upsert(sanitizedMovie); // Use upsert para evitar duplicações
      console.log('Movie created and upserted into RxDB');
    } catch (err) {
      console.error('Error creating movie:', err);
      setError(err.message);
    }
  };

  const updateMovie = async (id, updatedMovie) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedMovie,
          id: String(updatedMovie.id), // Garante que o ID seja string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update movie');
      }

      const updatedData = await response.json();

      // Converte o ID para string antes de salvar localmente
      const sanitizedUpdatedData = { ...updatedData, id: String(updatedData.id) };

      const moviesCollection = db.movies;
      await moviesCollection.upsert(sanitizedUpdatedData); // Atualiza no RxDB
      console.log('Movie updated in RxDB');
    } catch (err) {
      console.error('Error updating movie:', err);
      setError(err.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete movie');
      }
  
      const moviesCollection = db.movies;
      const doc = await moviesCollection.findOne().where('id').eq(String(id)).exec();
  
      if (doc && !doc._deleted) {
        try {
          await doc.remove();
          console.log(`Movie with ID ${id} deleted successfully.`);
        } catch (error) {
          if (error.rxdb && error.parameters && error.parameters.writeError) {
            console.warn('Conflict detected. Skipping redundant deletion attempt.');
          } else {
            throw error;
          }
        }
      } else {
        console.warn(`Movie with ID ${id} is already deleted or not found.`);
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError(err.message);
    }
  };
  

  return (
    <DatabaseContext.Provider
      value={{
        movies,
        error,
        createMovie,
        updateMovie,
        deleteMovie,
        isLoading,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
