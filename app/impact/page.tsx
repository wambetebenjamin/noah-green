import ImpactBoard from "@/components/impact/ImpactBoard";
import { IMAGES, layeredBg } from "@/lib/images";

export const metadata = {
  title: "City Impact Board",
  description:
    "Public recycling impact board for Nairobi: kilograms per material, monthly totals and household versus business contributions.",
};

export default function ImpactPage() {
  return (
    <>
      <div
        className="hero-wrap hero-wrap-2 ng-hero-2"
        style={{ backgroundImage: layeredBg(IMAGES.nairobiAerial.remote, IMAGES.nairobiAerial.local) }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Public impact board</h2>
              <h1 className="mb-3">What Nairobi keeps out of landfill</h1>
              <p>Open data from every weighed pickup across our coverage zones.</p>
            </div>
          </div>
        </div>
      </div>
      <section className="ftco-section">
        <div className="container">
          <ImpactBoard />
        </div>
      </section>
    </>
  );
}
