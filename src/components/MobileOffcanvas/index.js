"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Offcanvas } from "react-bootstrap";

import Logo from "../../../public/img/medzeal.png";

export default function MobileOffcanvas() {
  const pathname = usePathname();

  const [show, setShow] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Function to toggle the sub-menu
  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  // Function to check if a menu item is active
  const isActive = (path) => pathname === path;

  return (
    <>
      <button
        type="button"
        onClick={handleShow}
        className="mobile-menu-offcanvas-toggler"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      {/* <!-- Mobile Menu Modal --> */}
      <Offcanvas show={show} onHide={handleClose} className="mobile-menu-modal">
        <div className="modal-dialog offcanvas-dialog">
          <div className="modal-content">
            <div className="modal-header offcanvas-header">
              <div className="offcanvas-logo">
                <Link href="/">
                  <Image src={Logo} alt="#" width={134} height={50} />
                </Link>
              </div>
              <button type="button" className="btn-close" onClick={handleClose}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="mobile-menu-modal-main-body">
              {/* Offcanvas Menu */}
              <nav id="offcanvas-menu" className="navigation offcanvas-menu">
                <ul id="nav" className="list-none offcanvas-men-list">
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(1)}
                      href="#"
                    >
                      Home <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 1 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/") ? "active" : ""}`}
                          href="/"
                        >
                          Home Page 1
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/home-2") ? "active" : ""}`}
                          href="/home-2"
                        >
                          Home Page 2
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(2)}
                      href="#"
                    >
                      Doctors <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 2 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/doctors") ? "active" : ""}`}
                          href="/doctors"
                        >
                          Doctor
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/doctor-details") ? "active" : ""
                          }`}
                          href="/doctor-details"
                        >
                          Doctor Details
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(3)}
                      href="#"
                    >
                      Services <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 3 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/service") ? "active" : ""}`}
                          href="/service"
                        >
                          Service
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/service-details") ? "active" : ""
                          }`}
                          href="/service-details"
                        >
                          Service Details
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(4)}
                      href="#"
                    >
                      Pages <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 4 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/about") ? "active" : ""}`}
                          href="/about"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/appointment") ? "active" : ""
                          }`}
                          href="/appointment"
                        >
                          Appointment
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/time-table") ? "active" : ""
                          }`}
                          href="/time-table"
                        >
                          Time Table
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/testimonials") ? "active" : ""
                          }`}
                          href="/testimonials"
                        >
                          Testimonials
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/pricing") ? "active" : ""}`}
                          href="/pricing"
                        >
                          Our Pricing
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/register") ? "active" : ""
                          }`}
                          href="/register"
                        >
                          Sign Up
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/login") ? "active" : ""}`}
                          href="/login"
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/faq") ? "active" : ""}`}
                          href="/faq"
                        >
                          Faq
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/mail-success") ? "active" : ""
                          }`}
                          href="/mail-success"
                        >
                          Mail Success
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/404") ? "active" : ""}`}
                          href="/404"
                        >
                          404 Error
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(5)}
                      href="#"
                    >
                      Blogs <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 5 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/blog-grid") ? "active" : ""
                          }`}
                          href="/blog-grid"
                        >
                          Blog Grid
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/blog-single") ? "active" : ""
                          }`}
                          href="/blog-single"
                        >
                          Blog Details
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      onClick={handleClose}
                      className={` ${isActive("/contact") ? "active" : ""}`}
                      href="/contact"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            {/* Mobile menu modal bottom */}
            <div className="mobile-menu-modal-bottom">
              <Link href="/appointment" className="btn" onClick={handleClose}>
                Appointment
              </Link>
            </div>
          </div>
        </div>
      </Offcanvas>
      {/* <!-- End Mobile Menu Modal --> */}
    </>
  );
}
