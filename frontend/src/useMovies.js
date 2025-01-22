// src/useMovies.js

import { useEffect, useState } from 'react';
import { useDatabase } from './DatabaseProvider';

export const useMovies = () => {
  const { db, error } = useDatabase();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!db) return;

    const subscription = db.movies.find().sort({ name: 1 }).$.subscribe({
      next: (result) => {
        setMovies(result);
      },
      error: (err) => {
        console.error('Error in useMovies subscription:', err);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  return { movies, error };
};
