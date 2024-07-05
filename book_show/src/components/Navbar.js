import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function Navbar() {
    const user = useSelector(store => store.auth.user);
    const isSuperuser = useSelector(store => store.auth.isSuperuser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        description: "",
        image_url: "",
        ticket_price: 0,
        show_date: "",
        end_date: "",
        show_time: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        axios.post('https://example.com/api/events', formData, {
            headers: { 'Authorization': "Bearer " + user.token }
        })
        .then(response => {
            setLoading(false);
            navigate('/events'); // Assuming '/events' is the route for displaying events
        })
        .catch(error => {
            setLoading(false);
            setError('Error creating event: ' + error.message);
        });
    };

    const logout = () => {
        if (user) {
            setLoading(true);
            axios.post('http://127.0.0.1:8000/movieapi/logout', {}, {
                headers: { 'Authorization': "Token " + user.token }
            })
            .then(() => {
                setLoading(false);
                dispatch(removeUser());
                navigate('/login');
            })
            .catch(error => {
                setLoading(false);
                setError("Logout failed: " + error.message);
            });
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
                <h4 style={{ paddingLeft: '10px' }}>
                    <span>MOVIE</span>
                    <span>PLEX</span>
                </h4>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink exact to={"/"} className="nav-link" activeClassName="active">
                            Home
                        </NavLink>
                    </li>
                    {user ? (
                        <>
                            {isSuperuser && (
                                <>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/posts/create"} className="nav-link" activeClassName="active">
                                            Add Movie
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <span className="nav-link" onClick={logout}>
                                    {loading ? 'Logging out...' : 'Logout'}
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink to={"/register"} className="nav-link" activeClassName="active">
                                    Signup
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/login"} className="nav-link" activeClassName="active">
                                    Login
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </nav>
    );
}

export default Navbar;
