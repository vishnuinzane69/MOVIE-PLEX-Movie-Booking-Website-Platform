import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Register from "./components/auth/register";
import Login from "./components/auth/Login";
import CreatePost from "./components/admin/CreatePost";
import ListPost from "./components/admin/ListPost";
import EditPost from "./components/admin/EditPost";
import DeletePost from "./components/admin/adminside";
import MovieDetails from "./components/user/MovieDetails";
import UserMovieList from "./components/user/UserMovieList";
import UserViewMovie from "./components/user/userViewMovie";
import BookingForm from "./components/user/bookingform";

const router = createBrowserRouter([
    { path: '/', element: <App/> }, // Root route
    { path: '/register', element: <Register/> }, // Register route
    { path: '/login', element: <Login/> }, // Login route
    { path: '/admin/posts/create', element: <CreatePost/> }, // Create post route
    { path: '/admin/posts', element: <ListPost/> }, // List posts route
    { path: '/admin/posts/:movieId/edit', element: <EditPost/> }, // Edit post route
    { path: '/admin/posts/:movieId/delete', element: <DeletePost /> },
    { path: '/movie-details/:movieId/', element: <MovieDetails /> },



    { path: '/user/UserMovieList', element: <UserMovieList/> }, 
    { path: 'userViewMovie/:movieId', element: <UserViewMovie/> },
    { path: '/BookingForm/:movieId/:title', element: <BookingForm/> },
    

]);

export default router;
