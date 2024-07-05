import React from "react";
import { Link } from "react-router-dom";
import checkAuth from "../auth/checkAuth";
import { useSelector } from "react-redux";

function MovieList({ movies }) {
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <>
      {movies.map(movie => (
        <div key={movie.id} className="card mb-3" style={{ maxWidth: "300px" }}>
          <Link to={`/movie-details/${movie.id}`}>
            <img
              src={`http://127.0.0.1:8000/movieapi/${movie.poster}`}
              className="card-img-top"
              alt="Movie Poster"
              style={{ maxHeight: "250px" }}
            />
          </Link>
          <div className="card-body">
            <h5 className="card-title">{movie.title}</h5>
            <div className="d-flex justify-content-between">
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default checkAuth(MovieList);
