import ScheduleWizard from "@/components/schedule/ScheduleWizard";
import { IMAGES } from "@/lib/images";

export const metadata = {
  title: "Schedule a Pickup",
  description:
    "Book a free waste pickup in six steps: account type, materials with estimated kg, date and slot, address, contact and review.",
};

export default function SchedulePage() {
  return (
    <>
      <div
        className="hero-wrap hero-wrap-2 ng-hero-2"
        style={{ backgroundImage: `url('${IMAGES.heroSorting.remote}')` }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Free for registered households</h2>
              <h1 className="mb-3">Schedule a pickup in six short steps</h1>
              <p>Businesses receive a monthly invoice after weighing. No payment is taken online.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section">
        <div className="container">
          <ScheduleWizard />
        </div>
      </section>
    </>
  );
}
