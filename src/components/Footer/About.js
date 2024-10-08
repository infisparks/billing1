import Link from "next/link";

export default function About() {
  return (
    <>
      <div className="col-lg-3 col-md-6 col-12">
        <div className="single-footer">
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor sit am consectetur adipisicing elit do eiusmod
            tempor incididunt ut labore dolore magna.
          </p>

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
        </div>
      </div>
    </>
  );
}
