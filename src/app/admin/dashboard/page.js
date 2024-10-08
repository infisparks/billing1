"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0); // State for blog count
  const router = useRouter();

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');
    const usersRef = ref(db, 'users');
    const blogsRef = ref(db, 'blogs'); // Reference for blogs

    // Fetching the total number of appointments
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.values(data).flatMap(Object.values).length : 0;
      setAppointmentsCount(count);
    });

    // Fetching the total number of users
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      setUsersCount(count);
    });

    // Fetching the total number of blogs
    onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0; // Count blog posts
      setBlogsCount(count);
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="display-4 mb-4 text-center">Dashboard</h1>

      <div className="row">
        <div 
          className="col-md-4 mb-4"
          onClick={() => router.push('/admin/users')}
        >
          <div className="card text-center shadow-sm border-light">
            <div className="card-body">
              <h2 className="card-title">Total Users</h2>
              <p className="card-text display-4">{usersCount}</p>
              <button className="btn btn-primary">View Users</button>
            </div>
          </div>
        </div>

        <div 
          className="col-md-4 mb-4"
          onClick={() => router.push('/admin/appointments')}
        >
          <div className="card text-center shadow-sm border-light">
            <div className="card-body">
              <h2 className="card-title">Total Appointments</h2>
              <p className="card-text display-4">{appointmentsCount}</p>
              <button className="btn btn-primary">View Appointments</button>
            </div>
          </div>
        </div>

        <div 
          className="col-md-4 mb-4"
          onClick={() => router.push('/admin/blogmake')}
        >
          <div className="card text-center shadow-sm border-light">
            <div className="card-body">
              <h2 className="card-title">Total Blogs</h2>
              <p className="card-text display-4">{blogsCount}</p>
              <button className="btn btn-primary">View Blogs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
