"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import { FaPhoneAlt, FaMoneyBillWave, FaCreditCard, FaUser, FaCalendarAlt, FaClock, FaStethoscope, FaSyringe, FaComments } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';

const TodayAttendedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // References
    const appointmentsRef = ref(db, 'appointments');
    const doctorsRef = ref(db, 'doctors');

    // Fetch Appointments
    const handleAppointments = (snapshot) => {
      const data = snapshot.val();
      const today = new Date().toISOString().split('T')[0];

      const attendedAppointments = [];

      if (data) {
        Object.entries(data).forEach(([userId, userAppointments]) => {
          Object.entries(userAppointments).forEach(([id, details]) => {
            if (details.attended === true && details.appointmentDate === today) {
              attendedAppointments.push({ ...details, id, userId });
            }
          });
        });
      }

      setAppointments(attendedAppointments);
      setLoading(false);
    };

    // Fetch Doctors
    const handleDoctors = (snapshot) => {
      const data = snapshot.val();
      setDoctors(data || {});
    };

    // Attach Listeners
    onValue(appointmentsRef, handleAppointments);
    onValue(doctorsRef, handleDoctors);

    // Cleanup Listeners on Unmount
    return () => {
      off(appointmentsRef, 'value', handleAppointments);
      off(doctorsRef, 'value', handleDoctors);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Todays Attended Appointments</h1>

      {appointments.length > 0 ? (
        <div className="row">
          {appointments.map(
            ({
              id,
              userId,
              appointmentDate,
              appointmentTime,
              doctor,
              message,
              name,
              phone,
              treatment,
              subCategory,
              price,
              paymentMethod,
            }) => (
              <div key={id} className="col-lg-4 col-md-6 mb-4">
                <div className="card shadow-sm border-light h-100 hover-effect">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <FaUser className="me-2 text-primary" />
                      {name || 'N/A'}
                    </h5>
                    <p className="card-text mb-1">
                      <FaSyringe className="me-2 text-success" />
                      <strong>Subcategory:</strong> {subCategory || 'N/A'}
                    </p>
                    <p className="card-text mb-1">
                      <FaPhoneAlt className="me-2 text-warning" />
                      <strong>Phone:</strong> {phone || 'N/A'}
                    </p>
                    <p className="card-text mb-1">
                      <FaCalendarAlt className="me-2 text-secondary" />
                      <strong>Date:</strong> {appointmentDate || 'N/A'}
                    </p>
                    <p className="card-text mb-1">
                      <FaClock className="me-2 text-info" />
                      <strong>Time:</strong> {appointmentTime || 'N/A'}
                    </p>
                    <p className="card-text mb-1">
                      <FaStethoscope className="me-2 text-danger" />
                      <strong>Doctor:</strong> {doctors[doctor]?.name || doctor || 'N/A'}
                    </p>
                    <p className="card-text mb-1">
                      <FaComments className="me-2 text-muted" />
                      <strong>Message:</strong> {message || 'N/A'}
                    </p>
                    <p className="card-text mb-3 mt-auto">
                      <strong>Treatment:</strong> {treatment || 'N/A'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">
                        {price !== undefined && price !== null ? `RS ${price}` : 'N/A'}
                      </span>
                      <span>
                        <strong>Payment:</strong> {paymentMethod || 'N/A'}{' '}
                        {paymentMethod === 'Cash' ? (
                          <FaMoneyBillWave className="text-success" title="Cash Payment" />
                        ) : paymentMethod === 'Online' ? (
                          <FaCreditCard className="text-primary" title="Online Payment" />
                        ) : null}
                      </span>
                    </div>
                    <a href={`tel:${phone}`} className="btn btn-outline-info mt-3 w-100">
                      <FaPhoneAlt className="me-2" />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center text-muted">
          <p>No attended appointments found for today.</p>
        </div>
      )}

      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          transition: transform 0.3s;
          cursor: pointer;
        }
        .card-title {
          display: flex;
          align-items: center;
          font-size: 1.25rem;
        }
        .card-text {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }
        .badge {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default TodayAttendedAppointments;
