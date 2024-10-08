import SectionHead from "@/components/SectionHead";
import PricingData from "./PricingData";

export default function Pricing() {
  return (
    <>
      <section className="pricing-table section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SectionHead
                title="We Provide You The Best Treatment In Reasonable Price"
                desc="Lorem ipsum dolor sit amet consectetur adipiscing elit
                  praesent aliquet. pretiumts"
              />
            </div>
          </div>
          <div className="row">
            <PricingData />
          </div>
        </div>
      </section>
    </>
  );
}
