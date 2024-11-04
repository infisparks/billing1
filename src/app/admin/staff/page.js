"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from next/link
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue } from 'firebase/database';

const Pages = () => {
  const [unapprovedCount, setUnapprovedCount] = useState(0);

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');

    onValue(appointmentsRef, (snapshot) => {
      const appointments = snapshot.val();
      if (appointments) {
        const allAppointments = Object.entries(appointments).flatMap(([key, appointment]) => 
          Object.entries(appointment).map(([id, details]) => details)
        );

        // Count unapproved appointments
        const count = allAppointments.filter(appointment => !appointment.approved).length;
        setUnapprovedCount(count);
      }
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Dashboard</h1>
      <div className="row justify-content-center mt-4">
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Create Appointment</h5>
              <p className="card-text">Add a new appointment for a user.</p>
              <Link href="/admin/createData" className="btn btn-primary">Create Appointment</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Book Appointment</h5>
              <p className="card-text">Book an existing appointment for a user.</p>
              <Link href="/admin/addData" className="btn btn-secondary">Book Appointment</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Approved Appointments</h5>
              <p className="card-text">Manage approved appointments.</p>
              <Link href="/admin/approval" className="btn btn-success">Approved Appointments</Link>
              <p className="mt-3">
                Unapproved Appointments: <strong>{unapprovedCount}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">User Presence</h5>
              <p className="card-text">Track user attendance for appointments.</p>
              <Link href="/admin/attend" className="btn btn-warning">Mark User Present</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Today Appoinment</h5>
              <p className="card-text">today all user booked appoinemnt.</p>
              <Link href="/admin/todayattend" className="btn btn-warning">see all user appoinemnt</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">User History</h5>
              <p className="card-text">View user appointment history.</p>
              <Link href="/admin/userhistory" className="btn btn-info">User History</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;
