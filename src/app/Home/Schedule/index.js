import Link from "next/link";

export default function Schedule() {
  return (
    <section className="schedule">
      <div className="container">
        <div className="schedule-inner">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              {/* <!-- single-schedule --> */}
              <div className="single-schedule first">
                <div className="inner">
                  <div className="icon">
                    <i className="fa fa-ambulance"></i>
                  </div>
                  <div className="single-content">
                    <span>Immediate Assistance</span>
                    <h4>Emergency Physiotherapy</h4>
                    <p>
                      Our expert physiotherapists are available for urgent care to address acute injuries and pain relief.
                    </p>
                    <Link href="/time-table">
                      LEARN MORE<i className="fa fa-long-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              {/* <!-- single-schedule --> */}
              <div className="single-schedule middle">
                <div className="inner">
                  <div className="icon">
                    <i className="icofont-prescription"></i>
                  </div>
                  <div className="single-content">
                    <span>Appointment Scheduling</span>
                    <h4>Therapist Timetable</h4>
                    <p>
                      View our specialists availability and book your sessions for personalized physiotherapy treatments.
                    </p>
                    <Link href="/time-table">
                      LEARN MORE<i className="fa fa-long-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="col-lg-4 col-md-12 col-12">
              {/* <!-- single-schedule --> */}
              <div className="single-schedule last">
                <div className="inner">
                  <div className="icon">
                    <i className="icofont-ui-clock"></i>
                  </div>
                  <div className="single-content">
                    <span>Consultation Hours</span>
                    <h4>Our Opening Hours</h4>
                    <ul className="time-sidual">
                      <li className="day">
                        Monday - Friday <span>8:00 AM - 8:00 PM</span>
                      </li>
                      <li className="day">
                        Saturday <span>9:00 AM - 6:30 PM</span>
                      </li>
                      <li className="day">
                        Sunday <span>Closed</span>
                      </li>
                    </ul>
                    <Link href="/time-table">
                      LEARN MORE<i className="fa fa-long-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
