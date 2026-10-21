import Link from "next/link";
import { Banknote, Sprout, Ticket } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/rewards/FaqAccordion";
import { MATERIALS, pointsPerKg } from "@/lib/materials";

const PARTNERS = [
  "GreenLeaf Cafe",
  "EcoSoko Market",
  "Safi Solar",
  "Maji Bora Refills",
  "Boda Electric",
  "Asili Organics",
];

const REDEMPTIONS = [
  {
    icon: Banknote,
    title: "M-Pesa cash out",
    text: "From 500 points, in steps of 100. Every 2 points equals KES 1, sent to the number on your account within one working day.",
    chip: "Min 500 points",
  },
  {
    icon: Ticket,
    title: "Partner discounts",
    text: "From 300 points, in steps of 50. Vouchers for our fictional but very friendly eco partners below, valid for 90 days.",
    chip: "Min 300 points",
  },
  {
    icon: Sprout,
    title: "Tree planting in your name",
    text: "1000 points per indigenous seedling, planted in Ngong Hills Forest with county partners. You receive the planting date and a photo.",
    chip: "1000 points per tree",
  },
];

export const metadata = {
  title: "Reward Programme",
  description:
    "Earn points per kilogram recycled and redeem them for M-Pesa cash out, partner discounts or trees planted in your name.",
};

export default function RewardsPage() {
  return (
    <>
      <div className="hero-wrap hero-wrap-2 ng-hero-2" style={{ background: "#0f7fd9" }}>
        <div className="overlay" style={{ opacity: 0.15 }}></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Reward programme</h2>
              <h1 className="mb-3">Every kilogram has a price, and it is yours</h1>
              <p>Points per kg below. Redeem for cash, discounts or trees.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="Points earning table"
              title="What each stream pays"
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="ng-chart-card">
                <table className="ng-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Points per kg</th>
                      <th>5 kg earns</th>
                      <th>20 kg earns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATERIALS.map((material) => (
                      <tr key={material.code}>
                        <td>{material.name}</td>
                        <td>
                          <span className="ng-points-chip">{pointsPerKg(material.code)}</span>
                        </td>
                        <td>{pointsPerKg(material.code) * 5} points</td>
                        <td>{pointsPerKg(material.code) * 20} points</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="Redemption options"
              title="Three ways to spend your points"
            />
          </div>
          <div className="row">
            {REDEMPTIONS.map((item, index) => (
              <div className="col-md-4 mb-4" key={item.title}>
                <Reveal delay={index * 0.1}>
                  <div className="ng-material-card">
                    <div className="ng-material-icon" style={{ background: "#28a745" }}>
                      <item.icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="h5" style={{ color: "#33313b" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#808080" }}>{item.text}</p>
                    <span className="ng-points-chip">{item.chip}</span>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-10 text-center">
              <p className="mb-2" style={{ color: "#6c757d", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
                Eco partners
              </p>
              {PARTNERS.map((partner) => (
                <span className="ng-partner-badge" key={partner}>
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-3">
            <SectionHeading
              subheading="How to redeem"
              title="Three clicks from points to value"
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3 text-center">
              <div className="ng-step-card">
                <span className="ng-step-number">Step 1</span>
                <p className="mb-0" style={{ color: "#808080", fontSize: 14 }}>
                  Visit <Link href="/my-account">My Account</Link> and sign in.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-3 text-center">
              <div className="ng-step-card">
                <span className="ng-step-number">Step 2</span>
                <p className="mb-0" style={{ color: "#808080", fontSize: 14 }}>
                  Click Redeem now on your points balance card.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-3 text-center">
              <div className="ng-step-card">
                <span className="ng-step-number">Step 3</span>
                <p className="mb-0" style={{ color: "#808080", fontSize: 14 }}>
                  Select your option and confirm. We email you the voucher,
                  cash out reference or tree photo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-3">
            <SectionHeading subheading="FAQ" title="Questions members ask" />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
