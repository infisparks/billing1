import React from "react";

// SEO-friendly metadata for this specific page
export const metadata = {
  title: "Doctor Schedule | Medzeal Mumbra - Find Available Specialists",
  description:
    "Check the weekly schedule of our medical specialists at Medzeal Mumbra. Find available dermatologists, neurologists, oncologists, and more to book your appointments.",
  keywords:
    "doctor schedule, Medzeal Mumbra, available doctors, dermatologists, neurologists, oncologists, pain management, orthopedics, surgeons",
};

export default function DoctorSchedule() {
  const scheduleData = [
    {
      time: "9.00",
      doctors: [
        { name: "Dr. Tanner", specialty: "Dermatologist" },
        { name: "Dr. Kwak", specialty: "Ear, Nose Specialist" },
        { name: "Dr. Slaughter", specialty: "Neurologist" },
        { name: "", specialty: "" },
        { name: "Dr. Foley", specialty: "Oncologist" },
        { name: "Dr. Palmer", specialty: "Maxillofacial Surgeon" },
      ],
    },
    {
      time: "12.00",
      doctors: [
        { name: "", specialty: "" },
        { name: "Dr. Megahead", specialty: "Orthopedics" },
        { name: "Dr. Neupane", specialty: "Pain Management" },
        { name: "Dr. Breidin", specialty: "Radiologist" },
        { name: "", specialty: "" },
        { name: "Dr. Pipe", specialty: "Surgeon" },
      ],
    },
    {
      time: "15.00",
      doctors: [
        { name: "Dr. Tanner", specialty: "Dermatologist" },
        { name: "Dr. Kwak", specialty: "Ear, Nose Specialist" },
        { name: "", specialty: "" },
        { name: "Dr. Slaughter", specialty: "Neurologist" },
        { name: "Dr. Foley", specialty: "Oncologist" },
        { name: "", specialty: "" },
      ],
    },
    {
      time: "18.00",
      doctors: [
        { name: "Dr. Slaughter", specialty: "Neurologist" },
        { name: "Dr. Megahead", specialty: "Orthopedics" },
        { name: "Dr. Neupane", specialty: "Pain Management" },
        { name: "Dr. Breidin", specialty: "Radiologist" },
        { name: "Dr. Kwak", specialty: "Ear, Nose Specialist" },
        { name: "Dr. Pipe", specialty: "Surgeon" },
      ],
    },
  ];

  return (
    <>
      <div className="doctor-calendar-table table-responsive">
        <h1>Doctor Schedule</h1>
        <p>Check out our weekly schedule to find available doctors and specialists at Medzeal Mumbra.</p>

        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>

          <tbody>
            {scheduleData.map((slot, index) => (
              <tr key={index}>
                <td>
                  <span className="time">{slot.time}</span>
                </td>
                {slot.doctors.map((doctor, subIndex) => (
                  <td key={subIndex}>
                    {doctor.name && <h3>{doctor.name}</h3>}
                    {doctor.specialty && <span>{doctor.specialty}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
