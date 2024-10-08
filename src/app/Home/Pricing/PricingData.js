import Link from "next/link";

const Data = [
  {
    title: "Plastic Surgery",
    icon: "icofont-ui-cut",
    price: 199,
    features: [
      { name: "Lorem ipsum dolor sit", status: true },
      { name: "Cubitur sollicitudin fentum", status: true },
      { name: "Nullam interdum enim", status: false },
      { name: "Donec ultricies metus", status: false },
      { name: "Pellentesque eget nibh", status: false },
    ],
  },
  {
    title: "Teeth Whitening",
    icon: "icofont-tooth",
    price: 299,
    features: [
      { name: "Lorem ipsum dolor sit", status: true },
      { name: "Cubitur sollicitudin fentum", status: true },
      { name: "Nullam interdum enim", status: true },
      { name: "Donec ultricies metus", status: false },
      { name: "Pellentesque eget nibh", status: false },
    ],
  },
  {
    title: "Heart Surgery",
    icon: "icofont-heart-beat",
    price: 399,
    features: [
      { name: "Lorem ipsum dolor sit", status: true },
      { name: "Cubitur sollicitudin fentum", status: true },
      { name: "Nullam interdum enim", status: true },
      { name: "Donec ultricies metus", status: true },
      { name: "Pellentesque eget nibh", status: true },
    ],
  },
];

export default function PricingData() {
  return (
    <>
      {Data.map((pricing, index) => (
        <div key={index} className="col-lg-4 col-md-12 col-12">
          <div className="single-table">
            <div className="table-head">
              <div className="icon">
                <i className={`icofont ${pricing.icon}`}></i>
              </div>
              <h4 className="title">{pricing.title}</h4>
              <div className="price">
                <p className="amount">
                  ${pricing.price}
                  <span>/ Per Visit</span>
                </p>
              </div>
            </div>
            <ul className="table-list">
              {pricing.features.map((feature, index) => (
                <li key={index} className={feature.status ? "" : "cross"}>
                  {feature.status ? (
                    <i className="icofont icofont-ui-check"></i>
                  ) : (
                    <i className="icofont icofont-ui-close"></i>
                  )}
                  {feature.name}
                </li>
              ))}
            </ul>
            <div className="table-bottom">
              <Link className="btn" href="#">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
