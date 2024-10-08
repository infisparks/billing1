import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

import DoctorImg from "../../../public/img/doctor-detail.jpg";
import Header from "@/components/Header/Header";

export default function DoctorDetails() {
  return (
    <>
      <Header />

      <Breadcrumbs title="Doctor Details" menuText="Doctor Details" />

      <div className="doctor-details-area section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="doctor-details-item doctor-details-left">
                <Image src={DoctorImg} alt="#" width={479} height={551} />
                <div className="doctor-details-contact">
                  <h3>Contact info</h3>
                  <ul className="basic-info">
                    <li>
                      <i className="icofont-ui-call"></i>
                      Call : +07 554 332 322
                    </li>
                    <li>
                      <i className="icofont-ui-message"></i>
                      hello@medsev.com
                    </li>
                    <li>
                      <i className="icofont-location-pin"></i>
                      4th Floor, 408 No Chamber
                    </li>
                  </ul>

                  <ul className="social">
                    <li>
                      <Link href="#">
                        <i className="icofont-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icofont-google-plus"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icofont-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icofont-vimeo"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icofont-pinterest"></i>
                      </Link>
                    </li>
                  </ul>

                  <div className="doctor-details-work">
                    <h3>Working hours</h3>
                    <ul className="time-sidual">
                      <li className="day">
                        Monday - Fridayp <span>8.00-20.00</span>
                      </li>
                      <li className="day">
                        Saturday <span>9.00-18.30</span>
                      </li>
                      <li className="day">
                        Monday - Thusday <span>9.00-15.00</span>
                      </li>
                      <li className="day">
                        Monday - Fridayp <span>8.00-20.00</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="doctor-details-item">
                <div className="doctor-details-right">
                  <div className="doctor-name">
                    <h3 className="name">Dr. Sarah Taylor</h3>
                    <p className="deg">Neurosurgeon.</p>
                    <p className="degree">
                      MBBS in Neurology, PHD in Neurosurgeon.
                    </p>
                  </div>
                  <div className="doctor-details-biography">
                    <h3>Biography</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra maecenas accumsan lacus vel
                      facilisis.Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit, sed do eiusmod tempor incididunt.
                    </p>
                    <br />
                    <p>
                      Risus commodo viverra maecenas accumsan lacus vel
                      facilisis.Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit, sed do eiusmod tempor incididunt.
                    </p>
                  </div>
                  <div className="doctor-details-biography">
                    <h3>Education</h3>
                    <ul>
                      <li>
                        PHD degree in Neorology at University of Mediserv (2006)
                      </li>
                      <li>
                        Master of Neoro Surgery at University of Mediserv (2002)
                      </li>
                      <li>
                        MBBS degree in Neurosciences at University of Mediserv
                        (2002)
                      </li>
                      <li>
                        Higher Secondary Certificate at Mediserv collage (1991)
                      </li>
                    </ul>
                  </div>
                  <div className="doctor-details-biography">
                    <h3>Biography</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra
                    </p>
                    <br />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                      commodo viverra
                    </p>
                    <br />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua. Quis ipsum suspendisse ultrices gravida.
                      Risus commodo viverra eiusmod tempor incididunt ut labore
                      et dolore magna.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
