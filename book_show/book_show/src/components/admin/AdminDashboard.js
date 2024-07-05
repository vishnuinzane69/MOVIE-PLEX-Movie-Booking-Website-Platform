import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListPost from "./ListPost";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false); // Define loading state
  const [error, setError] = useState(null); // Define error state
  const user = useSelector((state) => state.auth.user);
  const token = user.token;

  useEffect(() => {
    fetchMovies(); // Fetch movies on component mount
  }, []); // Empty dependency array to execute only once

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
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">Movies</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Link to="/create" className="btn btn-info mb-2">
              Create Movie
            </Link>
          </div>
        </div>
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-lg-4 col-md-6 mb-4">
              <ListPost movie={movie} refresh={fetchMovies} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default checkAuth(AdminDashboard);
