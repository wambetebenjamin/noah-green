import { Building2, Factory, Hotel, Trees } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CorporateForm from "@/components/corporate/CorporateForm";
import { WHATSAPP_URL } from "@/lib/constants";
import { IMAGES, layeredBg } from "@/lib/images";

const TIERS = [
  {
    name: "Starter",
    volume: "Up to 500 kg per month",
    price: "KES 8,000 to 15,000 per month",
    features: [
      "Two scheduled collections per week",
      "Colour coded bins for four streams",
      "Monthly weighing report",
    ],
  },
  {
    name: "Growth",
    volume: "500 kg to 3,000 kg per month",
    price: "KES 15,000 to 45,000 per month",
    features: [
      "Daily or alternate day collections",
      "On site sorting training for staff",
      "Quarterly impact report for your CSR file",
    ],
  },
  {
    name: "Enterprise",
    volume: "Above 3,000 kg per month",
    price: "From KES 45,000 per month, quoted per site",
    features: [
      "Dedicated truck and account manager",
      "Baling equipment on site where space allows",
      "Staff reward points pooled into a tree fund",
    ],
  },
];

const SEGMENTS = [
  { icon: Building2, title: "Offices", text: "Paper heavy streams, secure shredding bins and e-waste days twice a year." },
  { icon: Trees, title: "Estates", text: "Central collection points, resident awareness days and one estate wide invoice." },
  { icon: Hotel, title: "Hotels", text: "Organic waste from kitchens, glass from bars and textiles from housekeeping, all logged." },
  { icon: Factory, title: "Factories", text: "Production offcuts, metal scrap and pallet wood routed to the right buyers." },
];

export const metadata = {
  title: "Corporate Waste Management",
  description:
    "Bulk collection contracts for offices, estates, hotels and factories in Nairobi, with volume tiers, weighing reports and one monthly invoice.",
};

export default function CorporatePage() {
  return (
    <>
      <div
        className="hero-wrap hero-wrap-2 ng-hero-2"
        style={{ backgroundImage: layeredBg(IMAGES.nairobiSkyline.remote, IMAGES.nairobiAerial.local) }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Corporate programme</h2>
              <h1 className="mb-3">Bulk collection contracts that pay for themselves</h1>
              <p>
                Less skip hire, cleaner premises, a monthly impact report your
                board will like.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="Who we serve"
              title="Four premises types, one simple contract"
            />
          </div>
          <div className="row">
            {SEGMENTS.map((item, index) => (
              <div className="col-md-6 col-lg-3 mb-4" key={item.title}>
                <Reveal delay={index * 0.08}>
                  <div className="ng-step-card">
                    <div className="ng-material-icon" style={{ background: "#0f7fd9" }}>
                      <item.icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="h5" style={{ color: "#33313b" }}>
                      {item.title}
                    </h3>
                    <p className="mb-0" style={{ fontSize: 14, color: "#808080" }}>
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="Volume tiers"
              title="Indicative pricing ranges"
              intro="Final quotes depend on distance, frequency and stream mix. Every tier includes weighing reports and reward points for your staff pool."
            />
          </div>
          <div className="row justify-content-center">
            {TIERS.map((tier, index) => (
              <div className="col-md-4 mb-4" key={tier.name}>
                <Reveal delay={index * 0.1}>
                  <div className="ng-material-card text-center">
                    <span className="ng-points-chip">{tier.volume}</span>
                    <h3 className="h4 mt-3 mb-2" style={{ color: "#33313b" }}>
                      {tier.name}
                    </h3>
                    <p style={{ color: "#2b98f0", fontWeight: 700 }}>{tier.price}</p>
                    <ul className="list-unstyled text-left mb-0">
                      {tier.features.map((feature) => (
                        <li key={feature} className="mb-2" style={{ fontSize: 14, color: "#808080", paddingLeft: 18, position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: 7, width: 8, height: 8, borderRadius: "50%", background: "#28a745" }}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-3">
            <SectionHeading
              subheading="Corporate enquiries"
              title="Tell us about your premises"
              intro="Prefer to talk first? WhatsApp the corporate desk on +254 112 272 061."
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <CorporateForm />
              <p className="text-center mt-3 mb-0">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-custom"
                >
                  Or WhatsApp us the same details
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
