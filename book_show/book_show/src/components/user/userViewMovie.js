import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import Navbar from '../Navbar';
import checkAuth from '../auth/checkAuth';

function ListPosts() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);

  function fetchMovies() {
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/movieapi/list_event', {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      });
  }
  


  return (
    <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
      <style>
        {`
          @font-face {
            font-family: 'Material Symbols Outlined';
            src: url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
          }

          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined', sans-serif;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}
      </style>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">
              <b>Movie List</b>
            </h1>
          </div>
        </div>
        <div className="row">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <div className="card">
                  <div style={{ height: '300px', overflow: 'hidden' }}>
                    <img
                      src={`http://127.0.0.1:8000${movie.poster}`}
                      className="card-img-top"
                      alt={movie.title}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 'bold' }}>{movie.title}</h4>
                    <p className="card-text" style={{ fontFamily: 'Montserrat, sans-serif' }}>{movie.genre}</p>
                    <Link to={`/BookingForm/${movie.id}/${encodeURIComponent(movie.title)}`} className="btn btn-danger mb-3" style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: 'black', marginRight: '10px' }}>
                      Book Tickets
                    </Link>
                    {/* Google Fonts Icon */}
                    <Link to={`/movie-details/${movie.id}`} className="btn btn-info mb-3 material-symbols-outlined">
                      ℹ️
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default checkAuth(ListPosts);
