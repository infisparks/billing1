import SectionHead from "@/components/SectionHead";

import Video from "./Video";

export default function WhyChoose() {
  return (
    <>
      <section className="why-choose section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SectionHead
                title="We Offer Different Services To Improve Your Health"
                desc="Lorem ipsum dolor sit amet consectetur adipiscing elit praesent aliquet. pretiumts"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="choose-left">
                <h3>Who We Are</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas pharetra antege vel est lobortis, a commodo magna
                  rhoncus. In quis nisi non emet quam pharetra commodo.
                </p>
                <p>
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos.
                </p>
                <div className="row">
                  <div className="col-lg-6">
                    <ul className="list">
                      <li>
                        <i className="fa fa-caret-right"></i>Maecenas vitae
                        luctus nibh.
                      </li>
                      <li>
                        <i className="fa fa-caret-right"></i>Duis massa massa.
                      </li>
                      <li>
                        <i className="fa fa-caret-right"></i>Aliquam feugiat
                        interdum.
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <ul className="list">
                      <li>
                        <i className="fa fa-caret-right"></i>Maecenas vitae
                        luctus nibh.
                      </li>
                      <li>
                        <i className="fa fa-caret-right"></i>Duis massa massa.
                      </li>
                      <li>
                        <i className="fa fa-caret-right"></i>Aliquam feugiat
                        interdum.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="choose-right">
                <div className="video-image">
                  <div className="promo-video">
                    <div className="waves-block">
                      <div className="waves wave-1"></div>
                      <div className="waves wave-2"></div>
                      <div className="waves wave-3"></div>
                    </div>
                  </div>
                  <Video />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
