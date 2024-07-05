import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';

function BookingForm() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noOfSeats, setNoOfSeats] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [date, setDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(150);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const user = useSelector((store) => store.auth.user);
  const token = user?.token;
  const userId = user ? user.userId : null;

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId]);

  const fetchMovieDetails = (id) => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/movieapi/view_movie/${id}/`)
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        setError('Failed to fetch movie details. Please try again later.');
        setLoading(false);
      });
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };

  const handleSeatChange = (event) => {
    const numberOfSeats = parseInt(event.target.value);
    const newTotalPrice = numberOfSeats * (movie?.ticketPrice || 150);
    setNoOfSeats(numberOfSeats);
    setTotalPrice(newTotalPrice);
  };

  const handleTimeChange = (event) => {
    const selectedTime = event.target.value;
    setSelectedTime(selectedTime);
  };

  const validateForm = () => {
    return date && selectedTime && noOfSeats > 0;
  };

  function addBooking() {
    if (!validateForm()) {
      setBookingError('Please fill all fields correctly.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    axios
      .post(
        `http://127.0.0.1:8000/movieapi/movie_Booking/${movieId}/`,
        {
          user: userId,
          movie: movieId,
          date: date,
          time: selectedTime,
          no_of_seats: noOfSeats,
          ticket_price: movie?.ticketPrice || 150,
          total_price: totalPrice,
          film_name: movie?.title || 'unknown',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setBookingSuccess(true);
        setBookingLoading(false);
      })
      .catch((error) => {
        console.error('Error in movie booking:', error);
        setBookingError('Failed to book the ticket. Please try again later.');
        setBookingLoading(false);
      });
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {movie && (
        <div className="container d-flex justify-content-center mt-5 mb-5">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card">
              {bookingSuccess && (
                <div className="alert alert-success">Booking successful!</div>
              )}
              {bookingError && (
                <div className="alert alert-danger">{bookingError}</div>
              )}
              <div className="card-header">{movie.title}</div>
              <div className="card-body">
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Show Time:</label>
                  <select
                    className="form-control"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  >
                    <option value="">Select a time</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Seats:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={noOfSeats}
                    onChange={handleSeatChange}
                  />
                </div>
                <div className="form-group">
                  <label>Total Price:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={totalPrice}
                    readOnly
                  />
                </div>
                <div className="form-group text-center">
                  <button
                    className="btn btn-danger"
                    onClick={addBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Ticket'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default checkAuth(BookingForm);
