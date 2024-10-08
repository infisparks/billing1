"use client";

import { useState } from "react";

export default function Vission() {
  const [vissionData, setvissionData] = useState([
    {
      id: "item1",
      icon: "icofont-tick-mark",
      title: "Our Mission",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Quis ipsum suspendisse.",
    },
    {
      id: "item2",
      icon: "icofont-tick-mark",
      title: "Our Planning",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Quis ipsum suspendisse.",
    },
    {
      id: "item3",
      icon: "icofont-tick-mark",
      title: "Our Vision",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Quis ipsum suspendisse.",
    },
  ]);

  return (
    <>
      <section className="our-vision-area ptb-100 pt-0">
        <div className="container">
          <div className="row">
            {vissionData.map((items) => (
              <div className="col-lg-4 col-md-6 col-12" key={items.id}>
                <div className="single-vision-box">
                  <div className="icon">
                    <i className={items.icon}></i>
                  </div>
                  <h3>{items.title}</h3>
                  <p>{items.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
