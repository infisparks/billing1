"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { FaPhoneAlt } from 'react-icons/fa';

const TodayAttendedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = () => {
      const appointmentsRef = ref(db, 'appointments');
      onValue(appointmentsRef, (snapshot) => {
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
      });
    };

    const fetchDoctors = () => {
      const doctorsRef = ref(db, 'doctors');
      onValue(doctorsRef, (snapshot) => {
        const data = snapshot.val();
        setDoctors(data || {});
      });
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading appointments...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Todays Attended Appointments</h1>

      {appointments.length > 0 ? (
        <div className="row">
          {appointments.map(({ id, userId, appointmentDate, appointmentTime, doctor, message, name, phone, treatment, subCategory, price }) => (
            <div key={id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-light" style={{ borderRadius: '8px' }}>
                <div className="card-body">
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Subcategory:</strong> {subCategory || 'N/A'}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <p><strong>Date:</strong> {appointmentDate}</p>
                  <p><strong>Time:</strong> {appointmentTime}</p>
                  <p><strong>Doctor UID:</strong> {doctor}</p>
                  <p><strong>Treatment:</strong> {treatment}</p>
                  <p><strong>Price:</strong> {price !== undefined ? `RS ${price}` : 'N/A'}</p>
                  <p><strong>Message:</strong> {message}</p>
                  <a href={`tel:${phone}`} className="btn btn-info">
                    <FaPhoneAlt /> Call
                  </a>
                </div>
              </div>
            </div>
          ))}
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
