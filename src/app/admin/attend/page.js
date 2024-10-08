"use client"; 
import React, { useEffect, useState, useMemo } from 'react'; 
import { db } from '../../../lib/firebaseConfig'; 
import { ref, onValue, update } from 'firebase/database'; 

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

  const filteredAppointments = useMemo(() => { 
    if (!appointments) return []; 

    const allAppointments = Object.entries(appointments).flatMap(([userId, userAppointments]) => 
      Object.entries(userAppointments).map(([id, details]) => ({ ...details, id, userId })) 
    ); 

    return allAppointments.filter(({ appointmentDate, doctor, message, name, phone, approved }) => { 
      const isApproved = approved; 
      const isDateMatch = selectedDate ? appointmentDate === selectedDate : true; 
      const isMonthMatch = selectedMonth ? appointmentDate.split('-')[1] === selectedMonth : true; 
      const isYearMatch = selectedYear ? appointmentDate.split('-')[0] === selectedYear : true; 
      const isSearchMatch = 
        doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        phone.includes(searchTerm); 

      return isApproved && isDateMatch && isMonthMatch && isYearMatch && isSearchMatch; 
    }); 
  }, [appointments, selectedDate, selectedMonth, selectedYear, searchTerm]); 

  const today = new Date().toISOString().split('T')[0]; 

  const handleAttendance = (id, uid, status) => {
    const appointmentRef = ref(db, `appointments/${uid}/${id}`); 
    update(appointmentRef, { attended: status })
      .catch((error) => {
        console.error("Error updating attendance:", error);
      });
  };

  const renderAttendanceDot = (attended) => {
    if (attended === undefined) return <span className="badge bg-warning" title="Pending">Pending</span>;
    return attended ? (
      <span className="badge bg-success" title="Attended">✔️ Attended</span>
    ) : (
      <span className="badge bg-danger" title="Not Attended">❌ Not Attended</span>
    );
  };

  return ( 
    <div className="container mt-5"> 
      <h1 className="display-4 text-center mb-4">Appointments</h1> 

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

      <button 
        onClick={() => setSelectedDate(today)} 
        className="btn btn-primary mb-4" 
      > 
        Today Appointments 
      </button> 

      <div className="row"> 
        {filteredAppointments.length > 0 ? ( 
          filteredAppointments.map(({ id, userId, appointmentDate, appointmentTime, doctor, attended, message, price, name, phone }) => ( 
            <div key={id} className="col-md-6 mb-4"> 
              <div className="card shadow-sm border-light"> 
                <div className="card-body"> 
                  <p><strong>Dates:</strong> {appointmentDate}</p> 
                  <p><strong>Time:</strong> {appointmentTime}</p> 
                  <p><strong>Doctor:</strong> {doctor}</p> 
                  <p><strong>Attendance Status:</strong> {renderAttendanceDot(attended)}</p> 
                  <p><strong>Message:</strong> {message}</p> 
                  <p><strong>Price:</strong> ${price}</p> 
                  <p><strong>Name:</strong> {name}</p> 
                  <p><strong>Phone:</strong> {phone}</p> 
                  <a href={`tel:${phone}`} className="btn btn-info me-2"> 
                    Call 
                  </a> 
                  <button onClick={() => handleAttendance(id, userId, true)} className="btn btn-primary me-2"> 
                    Attend 
                  </button> 
                  <button onClick={() => handleAttendance(id, userId, false)} className="btn btn-secondary"> 
                    Not Attend 
                  </button> 
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
        .hover-shadow:hover { 
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); 
          transition: box-shadow 0.3s ease; 
        } 
      `}</style> 
    </div> 
  ); 
}; 

export default Approval;
