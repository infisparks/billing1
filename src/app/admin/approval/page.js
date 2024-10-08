"use client"; 
import React, { useEffect, useState, useMemo } from 'react'; 
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue, remove, update } from 'firebase/database'; 

const Approval = () => { 
  const [appointments, setAppointments] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(''); 
  const [selectedMonth, setSelectedMonth] = useState(''); 
  const [selectedYear, setSelectedYear] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => { 
    const appointmentsRef = ref(db, 'appointments'); 
    onValue(appointmentsRef, (snapshot) => { 
      setAppointments(snapshot.val()); 
    }); 
  }, []); 

  // Filter Appointments to only show unapproved appointments
  const filteredAppointments = useMemo(() => { 
    if (!appointments) return []; 

    const allAppointments = Object.entries(appointments).flatMap(([userId, userAppointments]) => 
      Object.entries(userAppointments).map(([id, details]) => ({ ...details, id, userId })) 
    ); 

    return allAppointments.filter(({ appointmentDate, doctor, message, name, phone, approved }) => { 
      const isDateMatch = selectedDate ? appointmentDate === selectedDate : true; 
      const isMonthMatch = selectedMonth ? appointmentDate.split('-')[1] === selectedMonth : true; 
      const isYearMatch = selectedYear ? appointmentDate.split('-')[0] === selectedYear : true; 
      const isSearchMatch = 
        doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        phone.includes(searchTerm); 
      
      // Only include unapproved appointments
      return isDateMatch && isMonthMatch && isYearMatch && isSearchMatch && !approved; 
    }); 
  }, [appointments, selectedDate, selectedMonth, selectedYear, searchTerm]); 

  // Calculate Total Price 
  const totalPrice = useMemo(() => { 
    return filteredAppointments.reduce((acc, { price }) => acc + price, 0); 
  }, [filteredAppointments]); 

  // Today's Date 
  const today = new Date().toISOString().split('T')[0]; 

  // Delete Appointment with Confirmation
  const handleDelete = (userId, appointmentId) => {
    const confirmed = window.confirm("Do you really want to delete this appointment?");
    if (confirmed) {
      const appointmentRef = ref(db, `appointments/${userId}/${appointmentId}`);
      remove(appointmentRef)
        .then(() => {
          // Successfully deleted from Firebase
          setAppointments((prev) => {
            if (!prev || !prev[userId]) {
              return prev; // If there's no previous state or no appointments for this user, return the previous state
            }
            const updatedAppointments = { ...prev };
            delete updatedAppointments[userId][appointmentId]; // Remove the appointment from the user's appointments
  
            // If the user has no more appointments, delete the user entry
            if (Object.keys(updatedAppointments[userId]).length === 0) {
              delete updatedAppointments[userId];
            }
  
            return updatedAppointments;
          });
          alert("Appointment deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting appointment:", error);
          alert("Failed to delete the appointment.");
        });
    }
  };
  
  

  // Approve Appointment 
  const handleApprove = (id, uid) => { 
    const appointmentRef = ref(db, `appointments/${uid}/${id}`); 
    const userApprovalRef = ref(db, `users/${uid}/approvedAppointments/${id}`); 

    // Update the appointment to include the uid of the approver
    update(appointmentRef, { approved: true })
      .then(() => {
        // Update the user's approved appointments
        return update(userApprovalRef, { approved: true });
      })
      .catch((error) => {
        console.error("Error updating approval:", error);
      });
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

      {/* Total Price Display */} 
      <h2 className="h5 mb-4">Total Price: ${totalPrice}</h2> 

      <div className="row"> 
        {filteredAppointments.length > 0 ? ( 
          filteredAppointments.map(({ id, uid, appointmentDate, appointmentTime, doctor, approved, message, price, name, phone }) => ( 
            <div key={id} className="col-md-6 mb-4"> 
              <div className="card shadow-sm border-light hover-shadow"> 
                <div className="card-body"> 
                  <p><strong>Date:</strong> {appointmentDate}</p> 
                  <p><strong>Time:</strong> {appointmentTime}</p> 
                  <p><strong>Doctor:</strong> {doctor}</p> 
                  <p><strong>Approved:</strong> {approved ? 'Yes' : 'No'}</p> 
                  <p><strong>Message:</strong> {message}</p> 
                  <p><strong>Price:</strong> ${price}</p> 
                  <p><strong>Name:</strong> {name}</p> 
                  <p><strong>Phone:</strong> {phone}</p> 
                  <button onClick={() => handleApprove(id, uid)} className="btn btn-success me-2"> 
                    Approve 
                  </button> 
                  <button onClick={() => handleDelete(uid, id)} className="btn btn-danger me-2"> 
                    Delete 
                  </button> 
                  <a href={`tel:${phone}`} className="btn btn-info"> 
                    Call 
                  </a> 
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

export default Approval;
