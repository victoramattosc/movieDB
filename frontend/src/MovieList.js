// MovieList.js

import React, { useState } from 'react';
import { useDatabase } from './DatabaseProvider';

export const MovieList = () => {
  const { movies, createMovie, deleteMovie, updateMovie, error, isLoading } = useDatabase();
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    name: '',
    description: '',
    duration: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMovie.name || !newMovie.description || !newMovie.duration || !newMovie.image) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    await createMovie({
      ...newMovie,
      duration: parseInt(newMovie.duration, 10), // Certifica que duration é um número
    });
    setNewMovie({ name: '', description: '', duration: '', image: '' });
    setShowForm(false);
  };

  // Lógica para avaliar um filme
  const handleRating = async (movie, rating) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${movie.id}/add_rating/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }), // Envia apenas a nota
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao adicionar avaliação');
      }

      const updatedMovie = await response.json();

      // Atualiza o filme via função fornecida pelo contexto
      await updateMovie(updatedMovie.id, updatedMovie);

      console.log('Avaliação do filme atualizada no RxDB');
    } catch (err) {
      console.error('Erro ao adicionar avaliação:', err);
      alert(`Erro ao adicionar avaliação: ${err.message}`);
    }
  };

  if (isLoading) {
    return <div>Carregando filmes...</div>;
  }

  return (
    <div className="movie-list-container">
      {/* Exibir Erros */}
      {error && <div className="error-message">{error}</div>}

      {/* Lista de filmes */}
      <div className="movie-list">
        {Array.isArray(movies) && movies.map((movie) => (
          <div
            key={movie.id} // Chave única baseada no ID
            className="movie-card"
          >
            {/* Botão "X" para deletar */}
            <button
              onClick={() => deleteMovie(movie.id)}
              className="delete-button"
            >
              X
            </button>

            <img src={movie.image} alt={movie.name} />
            <h3>{movie.name}</h3>
            <p>{movie.description}</p>
            <p>
              <strong>Duração:</strong> {movie.duration} minutos
            </p>
            <p>
              <strong>Avaliação:</strong>{' '}
              {movie.average_rating?.toFixed(1) || 'N/A'}
            </p>

            {/* Estrelas de Avaliação */}
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(movie, star)}
                  style={{
                    cursor: 'pointer',
                    color: star <= (movie.average_rating || 0) ? 'gold' : 'gray',
                    fontSize: '20px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botão para adicionar filmes */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="add-movie-button"
      >
        {showForm ? 'Cancelar' : 'Adicionar Filme'}
      </button>

      {/* Formulário para adicionar novo filme */}
      {showForm && (
        <form onSubmit={handleSubmit} className="movie-form">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={newMovie.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={newMovie.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="duration"
            placeholder="Duração (em minutos)"
            value={newMovie.duration}
            onChange={handleInputChange}
            required
            min="1"
          />
          <input
            type="url"
            name="image"
            placeholder="URL da Imagem"
            value={newMovie.image}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Salvar Filme</button>
        </form>
      )}
    </div>
  );
};
