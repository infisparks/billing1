"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AppointmentsEarningsGraphPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [monthData, setMonthData] = useState([]);

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

  useEffect(() => {
    const dayEarnings = {};
    const monthEarnings = {};

    appointments.forEach(({ appointmentDate, price }) => {
      const date = appointmentDate.split('T')[0]; // Format YYYY-MM-DD
      const month = appointmentDate.split('-').slice(0, 2).join('-'); // Format YYYY-MM

      // Calculate earnings by day
      dayEarnings[date] = (dayEarnings[date] || 0) + price;

      // Calculate earnings by month
      monthEarnings[month] = (monthEarnings[month] || 0) + price;
    });

    // Prepare data for day-wise earnings graph
    setDayData(Object.entries(dayEarnings).map(([date, totalPrice]) => ({ date, totalPrice })));

    // Prepare data for month-wise earnings graph
    setMonthData(Object.entries(monthEarnings).map(([month, totalPrice]) => ({ month, totalPrice })));
  }, [appointments]);

  // Chart data for day-wise earnings
  const dayEarningsChartData = {
    labels: dayData.map(data => data.date),
    datasets: [
      {
        label: 'Total Earnings Per Day',
        data: dayData.map(data => data.totalPrice),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Chart data for month-wise earnings
  const monthEarningsChartData = {
    labels: monthData.map(data => data.month),
    datasets: [
      {
        label: 'Total Earnings Per Month',
        data: monthData.map(data => data.totalPrice),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const downloadGraph = (type, graphId) => {
    const chartContainer = document.getElementById(graphId);
    html2canvas(chartContainer).then((canvas) => {
      const imgData = canvas.toDataURL(`image/${type}`);
      if (type === 'pdf') {
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(`${graphId}_graph.pdf`);
      } else {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${graphId}_graph.${type}`;
        link.click();
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Earnings Overview</h1>

      <div id="dailyEarningsChart" className="card mb-5 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Daily Earnings</h2>
          <Bar data={dayEarningsChartData} options={{ responsive: true }} />
        </div>
        <div className="card-footer text-center">
          <h4>Download Daily Earnings Graph</h4>
          <button 
            className="btn btn-primary me-2" 
            onClick={() => downloadGraph('pdf', 'dailyEarningsChart')}
          >
            Download PDF
          </button>
          <button 
            className="btn btn-secondary me-2" 
            onClick={() => downloadGraph('png', 'dailyEarningsChart')}
          >
            Download PNG
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => downloadGraph('jpg', 'dailyEarningsChart')}
          >
            Download JPG
          </button>
        </div>
      </div>

      <div id="monthlyEarningsChart" className="card mb-5 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Monthly Earnings</h2>
          <Bar data={monthEarningsChartData} options={{ responsive: true }} />
        </div>
        <div className="card-footer text-center">
          <h4>Download Monthly Earnings Graph</h4>
          <button 
            className="btn btn-primary me-2" 
            onClick={() => downloadGraph('pdf', 'monthlyEarningsChart')}
          >
            Download PDF
          </button>
          <button 
            className="btn btn-secondary me-2" 
            onClick={() => downloadGraph('png', 'monthlyEarningsChart')}
          >
            Download PNG
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => downloadGraph('jpg', 'monthlyEarningsChart')}
          >
            Download JPG
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: auto;
        }
        .card {
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AppointmentsEarningsGraphPage;
