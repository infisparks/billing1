"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../../lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faBookOpen,
  faCheckCircle,
  faUserCheck,
  faHistory,
  faFileInvoice,
  faBoxOpen,
  faCalendarDay,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);

  useEffect(() => {
    const appointmentsRef = ref(db, "appointments");

    const fetchAppointments = (snapshot) => {
      const appointments = snapshot.val();
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      if (appointments) {
        const allAppointments = Object.entries(appointments).flatMap(
          ([key, appointment]) =>
            Object.entries(appointment).map(([id, details]) => details)
        );

        // Count unapproved appointments
        const unapproved = allAppointments.filter(
          (appointment) => !appointment.approved
        ).length;

        // Count today's appointments
        const todayAppointments = allAppointments.filter(
          (appointment) => appointment.appointmentDate === today
        ).length;

        setUnapprovedCount(unapproved);
        setTodayAppointmentsCount(todayAppointments);
      }
    };

    onValue(appointmentsRef, fetchAppointments);

    return () => {
      // Cleanup listener
      onValue(appointmentsRef, () => {});
    };
  }, []);

  return (
    <div className="container-fluid p-4 bg-light">
      <h1 className="text-center mb-5 text-primary">Admin Dashboard</h1>
      <div className="row g-4">
        {[
          { title: "Create Appointment", icon: faCalendarPlus, link: "/admin/createData", color: "primary" },
          { title: "Book Appointment", icon: faBookOpen, link: "/admin/directbooking", color: "secondary" },
          { title: "Approved Appointments", icon: faCheckCircle, link: "/admin/approval", color: "success" },
          { title: "Mark User Present", icon: faUserCheck, link: "/admin/attend", color: "warning" },
          { title: "Today Appointments", icon: faCalendarDay, link: "/admin/todayattend", color: "info" },
          { title: "User History", icon: faHistory, link: "/admin/userhistory", color: "dark" },
          { title: "Download Invoice", icon: faFileInvoice, link: "/admin/invoice", color: "danger" },
          { title: "Product Entry", icon: faBoxOpen, link: "/admin/productsell", color: "primary" },
          { title: "Add Product", icon: faPlusCircle, link: "/admin/addproduct", color: "success" },
        ].map((item, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className={`card h-100 shadow-sm border-0 bg-white`}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <div className={`icon-wrapper text-center mb-3`}>
                    <FontAwesomeIcon icon={item.icon} className={`fa-3x text-${item.color}`} />
                  </div>
                  <h5 className="card-title text-center mb-3">{item.title}</h5>
                </div>
                <Link href={item.link} className={`btn btn-${item.color} text-white w-100`}>
                  {item.title === "Approved Appointments" ? "View Appointments" : "Go to " + item.title}
                </Link>
              </div>
              {item.title === "Approved Appointments" && (
                <div className="card-footer bg-transparent border-0">
                  <p className="text-center mb-0">
                    Unapproved: <span className="badge bg-danger">{unapprovedCount}</span>
                  </p>
                </div>
              )}
              {item.title === "Today Appointments" && (
                <div className="card-footer bg-transparent border-0">
                  <p className="text-center mb-0">
                    Total Today: <span className="badge bg-primary">{todayAppointmentsCount}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
