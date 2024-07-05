import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import CreateMovie from "./components/admin/Create";
import CreateShow from "./components/admin/CreateShow";
import ViewMovie from "./components/admin/ViewMovie";
import EditMovie from "./components/admin/EditMovie";
import MovieDetails from "./components/user/MovieDetails";
import BookTicket from "./components/user/BookTicket";

const router = createBrowserRouter([
  { path: "", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <App /> },
  { path: "/create-movie", element: <CreateMovie /> },
  { path: "/create-show/:movieId", element: <CreateShow /> },
  { path: "/view-movie/:movieId", element: <ViewMovie /> },
  { path: "/edit-movie/:movieId", element: <EditMovie /> },
  { path: "/movie-details/:movieId/", element: <MovieDetails /> },
  { path: "/book-show/:showId", element: <BookTicket /> },
]);

export default router;
