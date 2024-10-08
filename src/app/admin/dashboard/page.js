"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');
    const usersRef = ref(db, 'users');
    const blogsRef = ref(db, 'blogs');

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
      const count = data ? Object.keys(data).length : 0;
      setBlogsCount(count);
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="display-4 mb-4 text-center">Dashboard</h1>

      <div className="row">
        {/* Create a consistent card size using Bootstrap classes */}
        {[
          { title: 'Total Users', count: usersCount, path: '/admin/users' },
          { title: 'Total Appointments', count: appointmentsCount, path: '/admin/appointments' },
          { title: 'Total Blogs', count: blogsCount, path: '/admin/blogmake' },
          { title: 'Price Graph', path: '/admin/graphprice' },
          { title: 'Total Appointments Graph', path: '/admin/graphtotal' },
          { title: 'Contact Us', path: '/admin/contact' },  // New Contact Us card
        ].map((card, index) => (
          <div 
            key={index}
            className="col-md-4 mb-4 d-flex"
            onClick={() => router.push(card.path)}
          >
            <div className="card flex-fill text-center shadow-sm border-light">
              <div className="card-body">
                <h2 className="card-title">{card.title}</h2>
                {card.count !== undefined && (
                  <p className="card-text display-4">{card.count}</p>
                )}
                <button className="btn btn-primary">View {card.title}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
