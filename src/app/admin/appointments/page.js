"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
import * as XLSX from 'xlsx';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const appointmentsRef = ref(db, 'appointments');

    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const attendedAppointments = Object.entries(data).flatMap(([key, appointment]) => 
          Object.entries(appointment).map(([id, details]) => ({ ...details, id }))
        ).filter(({ approved, attended }) => approved && attended); 

        setAppointments(attendedAppointments);
      } else {
        setAppointments([]); 
      }
    });
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.filter(({ appointmentDate, doctor, message, name, phone }) => {
      const isDateMatch = selectedDate ? appointmentDate === selectedDate : true;
      const isMonthMatch = selectedMonth ? appointmentDate.split('-')[1] === selectedMonth : true;
      const isYearMatch = selectedYear ? appointmentDate.split('-')[0] === selectedYear : true;
      const isSearchMatch = 
        doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        phone.includes(searchTerm);

      return isDateMatch && isMonthMatch && isYearMatch && isSearchMatch;
    });
  }, [appointments, selectedDate, selectedMonth, selectedYear, searchTerm]);

  const totalPrice = useMemo(() => {
    return filteredAppointments.reduce((acc, { price }) => acc + price, 0);
  }, [filteredAppointments]);

  const today = new Date().toISOString().split('T')[0];

  // Function to handle export to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAppointments.map(appointment => ({
      'Date': appointment.appointmentDate,
      'Time': appointment.appointmentTime,
      'Doctor': appointment.doctor,
      'Message': appointment.message,
      'Price': appointment.price,
      'Name': appointment.name,
      'Phone': appointment.phone,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

    // Generate buffer
    XLSX.writeFile(workbook, 'appointments.xlsx');
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Appointments</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by doctor, message, name, or phone" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Filter Inputs */}
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
              <option key={i} value={String(i + 1).padStart(2, '0')}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
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

      {/* Today's Appointments Button */}
      <button 
        onClick={() => setSelectedDate(today)} 
        className="btn btn-primary mb-4"
      >
        Today Appointments
      </button>

      {/* Export to Excel Button */}
      <button 
        onClick={handleExport} 
        className="btn btn-success mb-4 float-end"
      >
        Export to Excel
      </button>

      {/* Total Price Display */}
      <h2 className="h5 mb-4">Total Price: ₹{totalPrice}</h2>

      <div className="row">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(({ id, appointmentDate, appointmentTime, doctor, message, price, name, phone }) => (
            <div key={id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-light hover-shadow">
                <div className="card-body">
                  <p><strong>Date:</strong> {appointmentDate}</p>
                  <p><strong>Time:</strong> {appointmentTime}</p>
                  <p><strong>Doctor:</strong> {doctor}</p>
                  <p><strong>Message:</strong> {message}</p>
                  <p><strong>Price:</strong> ₹{price}</p>
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Phone:</strong> {phone}</p>
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

      {/* Custom CSS for hover effect */}
      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AppointmentsPage;
