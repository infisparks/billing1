"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import { FaPhoneAlt, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

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
    return <div className="container mt-5">Loading appointments...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Today's Attended Appointments</h1>

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
              <div key={id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-light" style={{ borderRadius: '8px' }}>
                  <div className="card-body">
                    <p><strong>Name:</strong> {name || 'N/A'}</p>
                    <p><strong>Subcategory:</strong> {subCategory || 'N/A'}</p>
                    <p><strong>Phone:</strong> {phone || 'N/A'}</p>
                    <p><strong>Date:</strong> {appointmentDate || 'N/A'}</p>
                    <p><strong>Time:</strong> {appointmentTime || 'N/A'}</p>
                    <p>
                      <strong>Doctor:</strong> {doctors[doctor]?.name || doctor || 'N/A'}
                    </p>
                    <p><strong>Treatment:</strong> {treatment || 'N/A'}</p>
                    <p>
                      <strong>Price:</strong> {price !== undefined && price !== null ? `RS ${price}` : 'N/A'}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {paymentMethod || 'N/A'}
                      {' '}
                      {paymentMethod === 'Cash' ? (
                        <FaMoneyBillWave className="text-success" title="Cash Payment" />
                      ) : paymentMethod === 'Online' ? (
                        <FaCreditCard className="text-primary" title="Online Payment" />
                      ) : null}
                    </p>
                    <p><strong>Message:</strong> {message || 'N/A'}</p>
                    <a href={`tel:${phone}`} className="btn btn-info">
                      <FaPhoneAlt /> Call
                    </a>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-center text-muted">No attended appointments found for today.</p>
      )}

      <style jsx>{`
        .hover-effect:hover { background-color: #f5f5f5; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default TodayAttendedAppointments;
