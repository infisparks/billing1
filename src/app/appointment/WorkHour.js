"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from '@/lib/firebaseConfig'; // Ensure you import the initialized app

export default function WorkHour() {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const appointmentsRef = ref(db, `appointments/${user.uid}`);
      const unsubscribe = onValue(appointmentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const appointmentList = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value,
            }))
            .filter((appointment) => appointment.approved); // Filter to show only approved appointments

          setAppointments(appointmentList);
        } else {
          setAppointments([]); // No appointments found
        }
        setLoading(false); // Set loading to false after fetching
      });

      return () => unsubscribe(); // Clean up the subscription on unmount
    } else {
      setLoading(false); // If user is not logged in, stop loading
    }
  }, [auth]);

  if (loading) {
    return <div className="text-white">Loading appointments...</div>; // Loading indicator
  }

  return (
    <div className="work-hour p-6 bg-blue-600 rounded-lg shadow-lg">
      <h3 className="text-3xl text-white mb-4">Your Appointments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-2xl text-blue-600 font-semibold mb-2">{appointment.name}</h4>
              <p className="text-gray-700"><strong>Email:</strong> {appointment.email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {appointment.phone}</p>
              <p className="text-gray-700"><strong>Time:</strong> {appointment.time}</p>
              <p className="text-gray-700"><strong>Doctor:</strong> {appointment.doctor}</p>
              <p className="text-gray-700"><strong>Date:</strong> {appointment.createdDate}</p>
              <p className="text-gray-700"><strong>Message:</strong> {appointment.message}</p>
            </div>
          ))
        ) : (
          <div className="text-white">No approved appointments found.</div>
        )}
      </div>
    </div>
  );
}
