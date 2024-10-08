"use client";

import { useState } from "react";

export default function Mission() {
  const [missionData, setmissionData] = useState([
    {
      id: "item1",
      icon: "icofont-doctor",
      title: "Professional Staff",
      desc: "Lorem ipsum dolor sit amet sit, consectetur adipiscing elit.",
    },
    {
      id: "item2",
      icon: "icofont-kid",
      title: "Newborn Care",
      desc: "Lorem ipsum dolor sit amet sit, consectetur adipiscing elit.",
    },
    {
      id: "item3",
      icon: "icofont-laboratory",
      title: "Sufficient Lab Tests",
      desc: "Lorem ipsum dolor sit amet sit, consectetur adipiscing elit.",
    },
    {
      id: "item4",
      icon: "icofont-tooth",
      title: "Tooth Extraction",
      desc: "Lorem ipsum dolor sit amet sit, consectetur adipiscing elit.",
    },
  ]);

  return (
    <>
      <section className="our-mission-area ptb-100 pt-0">
        <div className="container-fluid p-0">
          <div className="row m-0">
            <div className="col-lg-6 col-md-12 p-0">
              <div className="our-mission-content">
                <span className="sub-title">Our Mission & Vision</span>
                <h2>Better Information, Better Health</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                  {missionData.map((items) => (
                    <li key={items.id}>
                      <div className="icon">
                        <i className={items.icon}></i>
                      </div>
                      <span>{items.title}</span>
                      {items.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="our-mission-image"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
