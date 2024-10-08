export default function DoctorSchedule() {
  const scheduleData = [
    {
      time: "9.00",
      doctors: [
        { name: "Dr. Tanner", specialty: "Dermatologists" },
        { name: "Dr. Kwak", specialty: "Ear, Nose" },
        { name: "Dr. Slaughter", specialty: "Neurologist" },
        { name: "", specialty: "" },
        { name: "Dr. Foley", specialty: "Oncologist" },
        { name: "Dr. Palmer", specialty: "Maxine lowe" },
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
        { name: "Dr. Pipe", specialty: "Surgeons" },
      ],
    },
    {
      time: "15.00",
      doctors: [
        { name: "Dr. Tanner", specialty: "Dermatologists" },
        { name: "Dr. Kwak", specialty: "Ear, Nose" },
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
        { name: "Dr. Kwak", specialty: "Ear, Nose" },
        { name: "Dr. Pipe", specialty: "Surgeons" },
      ],
    },
  ];

  return (
    <>
      <div className="doctor-calendar-table table-responsive">
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
