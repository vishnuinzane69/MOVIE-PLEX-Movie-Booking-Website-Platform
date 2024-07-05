import React from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

function ConfirmationPage() {
  const location = useLocation();
  const { bookingId, title, userId, qrCodeData } = location.state;
  const navigate = useNavigate();
  const handleViewHistory = () => {
    navigate(`/BookingHistory/${userId}`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title">Booking Confirmation</h3>
              <div className="card-text">
                <p><strong>Booking ID:</strong> {bookingId}</p>
                <p><strong>Title:</strong> {title}</p>
                {/* Render QR code */}
                <div className="qr-code">
                  <QRCode value={qrCodeData} />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleViewHistory}
                >
                  View My Booking History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;