"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { 
  FaPhoneAlt, 
  FaRegCheckCircle, 
  FaRegTimesCircle, 
  FaComments, 
  FaSave, 
  FaTimes 
} from 'react-icons/fa';


const Approval = () => {
  const [appointments, setAppointments] = useState(null);
  const [doctors, setDoctors] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // State to track edited prices and payment methods
  const [editedPrices, setEditedPrices] = useState({});
  const [editedPayments, setEditedPayments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      setAppointments(data);
    });

    // Fetch doctors data
    const doctorsRef = ref(db, 'doctors');
    onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      setDoctors(data);
    });
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    const allAppointments = Object.entries(appointments).flatMap(([userId, userAppointments]) =>
      Object.entries(userAppointments).map(([id, details]) => ({ ...details, id, userId }))
    );

    return allAppointments.filter(({ appointmentDate, doctor, message, name, phone, attended }) => {
      const isNotAttended = attended !== true;
      const isDateMatch = selectedDate ? appointmentDate === selectedDate : true;
      const isMonthMatch = selectedMonth ? appointmentDate.split('-')[1] === selectedMonth : true;
      const isYearMatch = selectedYear ? appointmentDate.split('-')[0] === selectedYear : true;
      const isSearchMatch =
        (doctor && doctor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message && message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (phone && phone.includes(searchTerm));

      return isNotAttended && isDateMatch && isMonthMatch && isYearMatch && isSearchMatch;
    });
  }, [appointments, selectedDate, selectedMonth, selectedYear, searchTerm]);

  const today = new Date().toISOString().split('T')[0];

  const handleAttendance = (id, uid, status) => {
    const appointmentRef = ref(db, `appointments/${uid}/${id}`);
    update(appointmentRef, { attended: status })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        setError("Failed to update attendance.");
      });
  };

  const renderAttendanceStatus = (attended) => {
    if (attended === undefined) return <span className="badge bg-warning" title="Pending">Pending</span>;
    return attended ? (
      <span className="badge bg-success" title="Attended"><FaRegCheckCircle /> Attended</span>
    ) : (
      <span className="badge bg-danger" title="Not Attended"><FaRegTimesCircle /> Not Attended</span>
    );
  };

  // Function to render approval status
  const renderApprovalStatus = (approved) => {
    if (approved) {
      return <span className="badge bg-info" title="Approved"><FaRegCheckCircle /> Approved</span>;
    }
    return null;
  };

  // Function to handle price change
  const handlePriceChange = (id, value) => {
    setEditedPrices(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Function to save the new price
  const saveNewPrice = async (id, uid) => {
    const newPrice = editedPrices[id];
    if (newPrice === undefined || newPrice === '') {
      setError("Price cannot be empty.");
      return;
    }

    const priceNumber = parseFloat(newPrice);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError("Please enter a valid positive number for the price.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const appointmentRef = ref(db, `appointments/${uid}/${id}`);
      await update(appointmentRef, { price: priceNumber });
      setSuccess("Price updated successfully.");
      setEditedPrices(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Error updating price:", error);
      setError("Failed to update price.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Function to handle payment method change
  const handlePaymentChange = (id, value) => {
    setEditedPayments(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Function to save the new payment method
  const saveNewPayment = async (id, uid) => {
    const newPayment = editedPayments[id];
    if (!newPayment) {
      setError("Payment method cannot be empty.");
      return;
    }

    if (!["Cash", "Online"].includes(newPayment)) {
      setError("Invalid payment method selected.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const appointmentRef = ref(db, `appointments/${uid}/${id}`);
      await update(appointmentRef, { paymentMethod: newPayment });
      setSuccess("Payment method updated successfully.");
      setEditedPayments(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      setError("Failed to update payment method.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Update the sendFeedback function
  const sendFeedback = (doctorUid) => {
    const doctor = doctors[doctorUid];

    if (doctor) {
      const feedbackLink = `http://medzeal.in/feedback?uid=${doctorUid}`;
      const message = `Hi! Please provide your feedback here: ${feedbackLink}`;
      const phoneNumber = `+${doctor.phone}`;
      const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      
      window.open(whatsappLink, '_blank');
    } else {
      console.error("Doctor not found for UID:", doctorUid);
      setError("Doctor not found.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Appointments</h1>

      {/* Display success or error messages */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by doctor, message, name, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-4 row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-select"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-select"
          >
            <option value="">All Years</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={2024 - i}>{2024 - i}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setSelectedDate(today)}
        className="btn btn-primary mb-4"
      >
        Today Appointments
      </button>

      <div className="row">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(({ id, userId, appointmentDate, appointmentTime, doctor, attended, message, name, phone, treatment, subCategory, price, approved, paymentMethod }) => (
            <div key={id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-light" style={{ borderRadius: '8px' }}>
                <div className="card-body">
                  <p className='text-black'><strong>Name:</strong> {name}</p>
                  <p><strong>Date:</strong> {appointmentDate}</p>
                  <p><strong>Time:</strong> {appointmentTime}</p>
                  <p><strong>Doctor UID:</strong> {doctor}</p>
                  <p><strong>Treatment:</strong> {treatment}</p>
                  <p><strong>Subcategory:</strong> {subCategory || 'N/A'}</p>
                  
                  {/* Price Section */}
                  <p>
                    <strong>Price:</strong>{' '}
                    <input
                      type="number"
                      value={editedPrices[id] !== undefined ? editedPrices[id] : price || ''}
                      onChange={(e) => handlePriceChange(id, e.target.value)}
                      className="form-control d-inline-block"
                      style={{ width: '100px', marginRight: '10px' }}
                      min="0"
                    />
                    <>
                      <button
                        onClick={() => saveNewPrice(id, userId)}
                        className="btn btn-success btn-sm me-2"
                        title="Save Price"
                        disabled={loading && editedPrices[id] !== undefined}
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => handlePriceChange(id, price || '')}
                        className="btn btn-secondary btn-sm"
                        title="Cancel"
                        disabled={loading && editedPrices[id] !== undefined}
                      >
                        <FaTimes />
                      </button>
                    </>
                  </p>

                  {/* Payment Method Section */}
                  <p>
                    <strong>Payment Method:</strong>{' '}
                    <select
                      value={editedPayments[id] !== undefined ? editedPayments[id] : paymentMethod || 'Cash'}
                      onChange={(e) => handlePaymentChange(id, e.target.value)}
                      className="form-select d-inline-block"
                      style={{ width: '150px', marginRight: '10px' }}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                    </select>
                    <>
                      <button
                        onClick={() => saveNewPayment(id, userId)}
                        className="btn btn-success btn-sm me-2"
                        title="Save Payment Method"
                        disabled={loading && editedPayments[id] !== undefined}
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => handlePaymentChange(id, paymentMethod || 'Cash')}
                        className="btn btn-secondary btn-sm"
                        title="Cancel"
                        disabled={loading && editedPayments[id] !== undefined}
                      >
                        <FaTimes />
                      </button>
                    </>
                  </p>

                  <p><strong>Attendance Status:</strong> {renderAttendanceStatus(attended)}</p>
                  {approved && (
                    <p><strong>Approval Status:</strong> {renderApprovalStatus(approved)}</p>
                  )}
                  
                  <p><strong>Message:</strong> {message}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <div className="d-flex justify-content-between">
                    <a href={`tel:${phone}`} className="btn btn-info me-2">
                      <FaPhoneAlt /> Call
                    </a>
                    <button onClick={() => handleAttendance(id, userId, true)} className="btn btn-success me-2">
                      Attend
                    </button>
                    <button onClick={() => handleAttendance(id, userId, false)} className="btn btn-danger me-2">
                      Not Attend
                    </button>
                    {/* Pass the doctor UID directly to sendFeedback */}
                    <button onClick={() => sendFeedback(doctor)} className="btn btn-warning">
                      <FaComments /> Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No appointments found for the selected criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-effect:hover { background-color: #f5f5f5; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Approval;
