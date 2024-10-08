"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { app } from '../../../lib/firebaseConfig'; // Ensure you import the initialized app
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header/Header";
import WorkHour from "@/app/appointment/WorkHour";

const DateInput = ({ selectedDate, onDateChange }) => {
  return (
    <input
      type="date"
      name="date"
      value={selectedDate}
      onChange={onDateChange}
      required
    />
  );
};

export default function Staff() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    subCategory: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    message: "",
  });

  const subServices = {
    Physiotherapy: [
      "Neuro Physiotherapy",
      "Cardiorespiratory Physiotherapy",
      "Sports Therapy",
      "Speech Therapy",
      "Paediatric Physiotherapy",
      "Orthopaedic Physiotherapy",
      "Post-Op Physiotherapy",
      "Geriatric Physiotherapy",
      "Maternal Physiotherapy",
    ],
    "Wellness Center": [
      "Massage Therapy",
      "Yoga",
      "Acupuncture",
      "Clinical Nutrition Counselling",
      "VR Therapy",
      "Sensory Desensitization",
      "De-addiction Programs",
      "Hijama Therapy",
      "Chiropractic Services",
    ],
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const treatmentPrices = {
      "Physiotherapy": 200,
      "Wellness Center": 400,
    };

    const appointmentData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      treatment: formData.get("treatment"),
      subCategory: formData.get("subCategory"),
      doctor: formData.get("doctor"),
      appointmentDate: formData.get("date"),
      appointmentTime: formData.get("time"),
      message: formData.get("message"),
      price: treatmentPrices[formData.get("treatment")],
      approved: true,
      uid: "test", // Add the uid field here
    };

    try {
      // Save appointment data
      const newAppointmentRef = push(ref(db, `appointments/test`)); // Create a unique reference for the appointment
      await set(newAppointmentRef, appointmentData);
      alert("Appointment booked successfully!");
      
    } catch (error) {
      console.error("Error during appointment booking:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Breadcrumbs title="Get Your Appointment" menuText=" Appointment" />

      <section className="appointment single-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12 col-12">
              <div className="appointment-inner">
                <div className="title">
                  <h3>Book your appointment</h3>
                  <p>We will confirm your appointment within 2 hours</p>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="name"
                          type="text"
                          placeholder="Name"
                          value={userDetails.name}
                          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={userDetails.email}
                          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="phone"
                          type="text"
                          placeholder="Phone"
                          value={userDetails.phone}
                          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <select
                          name="treatment"
                          className="form-select"
                          value={userDetails.treatment}
                          onChange={(e) => {
                            setUserDetails({ ...userDetails, treatment: e.target.value, subCategory: "" }); // Reset subcategory
                          }}
                          required
                        >
                          <option value="">Select Treatment</option>
                          <option value="Physiotherapy">Physiotherapy</option>
                          <option value="Wellness Center">Wellness Center</option>
                        </select>
                      </div>
                    </div>
                    {userDetails.treatment && (
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <select
                            name="subCategory"
                            className="form-select"
                            value={userDetails.subCategory}
                            onChange={(e) => setUserDetails({ ...userDetails, subCategory: e.target.value })}
                            required
                          >
                            <option value="">Select Subcategory</option>
                            {subServices[userDetails.treatment].map((sub, index) => (
                              <option key={index} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <select
                          name="doctor"
                          className="form-select"
                          value={userDetails.doctor}
                          onChange={(e) => setUserDetails({ ...userDetails, doctor: e.target.value })}
                          required
                        >
                          <option value="">Doctor</option>
                          <option value="Dr. Akther Hossain">Dr. Akther Hossain</option>
                          <option value="Dr. Dery Alex">Dr. Dery Alex</option>
                          <option value="Dr. Jovis Karon">Dr. Jovis Karon</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <DateInput 
                          selectedDate={userDetails.appointmentDate} 
                          onDateChange={(e) => setUserDetails({ ...userDetails, appointmentDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="time"
                          type="time"
                          placeholder="Time"
                          value={userDetails.appointmentTime}
                          onChange={(e) => setUserDetails({ ...userDetails, appointmentTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-12">
                      <div className="form-group">
                        <textarea
                          name="message"
                          placeholder="Write Your Message Here....."
                          value={userDetails.message}
                          onChange={(e) => setUserDetails({ ...userDetails, message: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <div className="button">
                          <button type="submit" className="btn">
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <WorkHour />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
