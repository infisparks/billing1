import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";
import Clients from "../Home/Clients";
import Appoinment from "../Home/Appoinment";
import Header from "@/components/Header/Header";

export default function Service() {
  return (
    <>
      <Header />

      <Breadcrumbs title="Service" menuText="Service" />

      <section className="services section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-prescription"
                title="General Treatment"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                luctus dictum eros ut imperdiet."
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-tooth"
                title="Teeth Whitening"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  luctus dictum eros ut imperdiet."
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-heart-alt"
                title="Heart Surgery"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  luctus dictum eros ut imperdiet."
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-listening"
                title="Ear Treatment"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  luctus dictum eros ut imperdiet."
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-eye-alt"
                title="Vision Problems"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  luctus dictum eros ut imperdiet."
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <ServiceCard
                icon="icofont icofont-blood"
                title="Blood Transfusion"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  luctus dictum eros ut imperdiet."
              />
            </div>
          </div>
        </div>
      </section>

      <Clients />

      <Appoinment />
    </>
  );
}
