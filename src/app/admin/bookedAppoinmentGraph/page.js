"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MostBookedAppointmentsGraphPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [mostBookedData, setMostBookedData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

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
    const serviceCounts = {};

    appointments.forEach(({ subService }) => {
      serviceCounts[subService] = (serviceCounts[subService] || 0) + 1;
    });

    setMostBookedData(Object.entries(serviceCounts).map(([service, count]) => ({ service, count })));
  }, [appointments]);

  const mostBookedChartData = {
    labels: mostBookedData.map(data => data.service),
    datasets: [
      {
        label: 'Number of Appointments',
        data: mostBookedData.map(data => data.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const downloadGraph = (type, graphId) => {
    setIsDownloading(true);
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
      setIsDownloading(false);
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Most Booked Appointments</h1>

      <div id="mostBookedAppointmentsChart" className="card mb-5 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Appointments by Service</h2>
          <Bar data={mostBookedChartData} options={{ responsive: true }} />
        </div>
        {!isDownloading && (
          <div className="card-footer text-center">
            <h4>Download Most Booked Appointments Graph</h4>
            <button 
              className="btn btn-primary me-2" 
              onClick={() => downloadGraph('pdf', 'mostBookedAppointmentsChart')}
            >
              Download PDF
            </button>
            <button 
              className="btn btn-secondary me-2" 
              onClick={() => downloadGraph('png', 'mostBookedAppointmentsChart')}
            >
              Download PNG
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => downloadGraph('jpg', 'mostBookedAppointmentsChart')}
            >
              Download JPG
            </button>
          </div>
        )}
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

export default MostBookedAppointmentsGraphPage;
