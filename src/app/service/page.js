"use client"
import Breadcrumbs from "@/components/Breadcrumbs";
import Clients from "../Home/Clients";
import Appoinment from "../Home/Appoinment";
import Header from "@/components/Header/Header";
import { useState } from "react";

export default function Service() {
  return (
    <>
      <Header />

      <Breadcrumbs title="Service" menuText="Service" />

      <section className="services section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Physiotherapy Services</h2>
          <div className="row">
            {/* Physiotherapy Cards */}
            {physiotherapyServices.map((service) => (
              <div className="col-lg-4 col-md-6 col-12 mb-4" key={service.title}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        <br></br>

          <h2 className="text-center mb-4">Wellness Center Services</h2>
          <div className="row">
            {/* Wellness Center Cards */}
            {wellnessServices.map((service) => (
              <div className="col-lg-4 col-md-6 col-12 mb-4" key={service.title}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Clients />

    </>
  );
}

// ServiceCard Component
const ServiceCard = ({ service }) => {
  return (
    <div
      className="card shadow border-0 h-100"
      style={{
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="card-body text-center">
        <div className="icon mb-3">
          <i className={service.icon} style={{ fontSize: '40px', color: '#007bff' }}></i>
        </div>
        <h5 className="card-title">{service.title}</h5>
        <p className="card-text">{service.desc}</p>
      </div>
    </div>
  );
};

// Sample Data (Add your actual services here)
const physiotherapyServices = [
  { icon: "icofont-physiotherapist", title: "Neuro Physiotherapy", desc: "Specialized physiotherapy for neurological conditions." },
  { icon: "icofont-physiotherapist", title: "Cardiorespiratory Physiotherapy", desc: "Treatment for respiratory and cardiovascular conditions." },
  { icon: "icofont-physiotherapist", title: "Sports Therapy", desc: "Therapy to enhance athletic performance and recovery." },
  { icon: "icofont-physiotherapist", title: "Speech Therapy", desc: "Therapy for speech and language disorders." },
  { icon: "icofont-physiotherapist", title: "Paediatric Physiotherapy", desc: "Specialized care for children's physical needs." },
  { icon: "icofont-physiotherapist", title: "Orthopaedic Physiotherapy", desc: "Rehabilitation for musculoskeletal injuries." },
  { icon: "icofont-physiotherapist", title: "Post-Op Physiotherapy", desc: "Rehabilitation following surgical procedures." },
  { icon: "icofont-physiotherapist", title: "Geriatric Physiotherapy", desc: "Therapy focused on older adults." },
  { icon: "icofont-physiotherapist", title: "Maternal Physiotherapy", desc: "Care for pregnant and postpartum women." },
];

const wellnessServices = [
  { icon: "icofont-massage", title: "Massage Therapy", desc: "Relaxing and therapeutic massages for wellness." },
  { icon: "icofont-yoga", title: "Yoga", desc: "Guided yoga sessions for physical and mental health." },
  { icon: "icofont-acupuncture", title: "Acupuncture", desc: "Traditional therapy for pain relief and healing." },
  { icon: "icofont-nutrition", title: "Clinical Nutrition Counselling", desc: "Personalized nutrition plans for health improvement." },
  { icon: "icofont-vr", title: "VR Therapy", desc: "Virtual reality therapy for anxiety and phobias." },
  { icon: "icofont-sensory", title: "Sensory Desensitization", desc: "Therapy for reducing sensitivity to stimuli." },
  { icon: "icofont-rehab", title: "De-addiction Programs", desc: "Support for overcoming addiction." },
  { icon: "icofont-hijama", title: "Hijama Therapy", desc: "Cupping therapy for detoxification and pain relief." },
  { icon: "icofont-chiropractic", title: "Chiropractic Services", desc: "Manual therapy for spinal and joint health." },
];
