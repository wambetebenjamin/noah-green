import Link from "next/link";
import Image from "next/image";
import {
  CalendarClock,
  Coins,
  Scale,
  Truck,
  UserPlus,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import MaterialGrid from "@/components/home/MaterialGrid";
import ImpactPreview from "@/components/home/ImpactPreview";
import ContactForm from "@/components/home/ContactForm";
import { MATERIALS, pointsPerKg } from "@/lib/materials";
import { COVERAGE_ZONES } from "@/lib/zones";
import { IMAGES, layeredBg } from "@/lib/images";
import HeroSlider from "@/components/home/HeroSlider";
import { WHATSAPP_URL } from "@/lib/constants";

const STEPS = [
  {
    icon: UserPlus,
    title: "Register your home or business",
    text: "Create a free account in two minutes. Households collect at no cost, businesses get one invoice per month.",
  },
  {
    icon: CalendarClock,
    title: "Schedule a pickup online",
    text: "Choose a day and a two hour slot that fits your week. We cover 24 zones across Nairobi.",
  },
  {
    icon: Coins,
    title: "Sort into colour coded categories",
    text: "Blue for paper, yellow for plastic, green for glass, grey for metal, orange crate for e-waste, brown for organic, purple sack for textiles.",
  },
  {
    icon: Scale,
    title: "We collect, weigh and log",
    text: "Our team weighs every bag at your gate and logs the kilograms straight to your account.",
  },
  {
    icon: Truck,
    title: "Earn reward points",
    text: "Points land in your account the same day. Cash out to M-Pesa, grab partner discounts, or plant a tree in your name.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The boys used to burn paper behind the house because the dump site was full. Now everything is sorted in buckets and picked every Thursday. My points paid school exercise books last term.",
    name: "Mama Celina W.",
    where: "Household, Langata",
    img: IMAGES.portraitElderlyWoman,
  },
  {
    quote:
      "I schedule from my phone during breakfast, sort the bottles and cartons over the week, and the team weighs them at the gate. Simple, on time, and the M-Pesa cash out actually works.",
    name: "Lemayian S.",
    where: "Household, Ongata Rongai",
    img: IMAGES.portraitMaasaiWoman,
  },
  {
    quote:
      "Our hotel sends out roughly 900 kg a month. One invoice, one account manager, and a monthly impact report our guests love reading in the lobby.",
    name: "Zawadi M.",
    where: "Operations Lead, Riverside Gardens Hotel",
    img: IMAGES.portraitUrbanMan,
  },
];

export const metadata = {
  title: "Waste Collection and Recycling for Nairobi",
  description:
    "Schedule free waste pickups, sort with our colour coded guide and earn reward points for every kilogram you recycle in Nairobi.",
};

export default function HomePage() {
  return (
    <>
      <div
        className="hero-wrap js-fullheight ng-hero"
        data-stellar-background-ratio="0.5"
      >
        <HeroSlider />
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-start">
            <div className="col-md-7 ftco-animate">
              <h2 className="subheading">{`Sort it. Schedule it. Save the city.`}</h2>
              <h1 className="mb-4">
                Recycling that pays you back, for every home and business in
                Nairobi.
              </h1>
              <p>
                <Link href="/schedule" className="btn btn-primary mr-md-3 py-3 px-4 mb-2">
                  Schedule a Pickup
                </Link>
                <Link href="/auth/signup" className="btn ng-btn-yellow py-3 px-4 mb-2">
                  Join the Programme
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section ftco-no-pt">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-2">
            <SectionHeading
              subheading="City impact, live"
              title="What Nairobi sorted this month"
              intro="Every pickup is weighed and logged. These public numbers update as our trucks finish their rounds."
            />
          </div>
          <ImpactPreview />
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="What we collect"
              title="Seven streams, seven colours"
              intro="Sort at home using the colour coded categories. Anything on the accept list earns points per kilogram."
            />
          </div>
          <MaterialGrid />
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <Link href="/sort-guide" className="btn-custom">
                Read the full sorting guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="How it works"
              title="From your gate to a second life"
            />
          </div>
          <div className="row">
            {STEPS.map((step, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={step.title}>
                <Reveal delay={index * 0.08}>
                  <div className="ng-step-card">
                    <span className="ng-step-number">Step {index + 1}</span>
                    <div className="ng-material-icon" style={{ background: "#0f7fd9" }}>
                      <step.icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="h5" style={{ color: "#33313b" }}>
                      {step.title}
                    </h3>
                    <p className="mb-0" style={{ fontSize: 14, color: "#808080" }}>
                      {step.text}
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
              subheading="Reward programme"
              title="Points that turn into real value"
              intro="Cash out to M-Pesa from 500 points, spend 300 points on partner discounts, or give 1000 points per tree planted in your name."
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="ng-chart-card">
                <table className="ng-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Sorting colour</th>
                      <th>Example 10 kg earns</th>
                      <th>Points per kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATERIALS.map((material) => (
                      <tr key={material.code}>
                        <td>{material.name}</td>
                        <td>{material.binLabel}</td>
                        <td>{pointsPerKg(material.code) * 10} points</td>
                        <td>
                          <span className="ng-points-chip">
                            {pointsPerKg(material.code)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center mt-4">
                  <Link href="/rewards" className="btn btn-primary py-3 px-4">
                    See all redemption options
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-3">
            <SectionHeading
              subheading="Coverage zones"
              title="Where our trucks roll today"
              intro="24 zones and counting. Not on the list yet? Join the waitlist on WhatsApp and we will route a truck your way soon."
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              {COVERAGE_ZONES.map((zone) => (
                <span className="ng-zone-chip" key={zone}>
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section testimony-section ftco-bg-dark">
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <SectionHeading
              subheading="Testimonials"
              title="Voices from the estates"
              white
            />
          </div>
          <div className="row">
            {TESTIMONIALS.map((item, index) => (
              <div className="col-md-4 mb-4" key={item.name}>
                <Reveal delay={index * 0.1}>
                  <div className="ng-testimony-card">
                    <Image
                      className="ng-avatar"
                      src={item.img.local}
                      alt={item.img.alt}
                      width={72}
                      height={72}
                    />
                    <p className="quote">"{item.quote}"</p>
                    <div className="ng-who">{item.name}</div>
                    <div className="ng-where">{item.where}</div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="ftco-section ftco-intro"
        style={{ backgroundImage: layeredBg(IMAGES.nairobiGreenCity.remote, IMAGES.nairobiAerial.local) }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 text-center">
              <h2 className="mb-3" style={{ color: "#fff" }}>
                Managing a business? Ask about our bulk collection contract.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)" }}>
                Offices, estates, hotels and factories get scheduled bulk
                rounds, weighing reports and one monthly invoice.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn ng-btn-yellow py-3 px-4 mr-md-3 mb-2"
              >
                WhatsApp the corporate desk
              </a>
              <Link href="/corporate" className="btn btn-primary py-3 px-4 mb-2">
                Corporate programme
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center pb-4 mb-3">
            <SectionHeading
              subheading="Talk to us"
              title="Questions, ideas, estate partnerships"
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="wrap-appointment bg-white d-md-flex p-4">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
