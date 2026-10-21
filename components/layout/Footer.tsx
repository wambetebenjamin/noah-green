import Link from "next/link";
import { SITE, WHATSAPP_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="footer ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <h2 className="footer-heading">Noah Green</h2>
            <p>
              {SITE.tagline} Waste collection, sorting and recycling for
              Nairobi homes and businesses. Every kilogram you sort keeps a
              drain clear, a street clean and a landfill lighter.
            </p>
            <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-4">
              <li className="ftco-animate">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <span className="fa fa-comment"></span>
                </a>
              </li>
              <li className="ftco-animate">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <span className="fa fa-facebook"></span>
                </a>
              </li>
              <li className="ftco-animate">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <span className="fa fa-instagram"></span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <h2 className="footer-heading">Programme</h2>
            <ul className="list-unstyled">
              <li>
                <Link href="/schedule" className="py-1 d-block">
                  Schedule a Pickup
                </Link>
              </li>
              <li>
                <Link href="/sort-guide" className="py-1 d-block">
                  Sorting Guide
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="py-1 d-block">
                  Reward Programme
                </Link>
              </li>
              <li>
                <Link href="/impact" className="py-1 d-block">
                  City Impact Board
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="py-1 d-block">
                  Corporate Contracts
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="py-1 d-block">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 pl-lg-5 mb-4 mb-md-0">
            <h2 className="footer-heading">Legal</h2>
            <ul className="list-unstyled">
              <li>
                <Link href="/legal/privacy-policy" className="py-1 d-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="py-1 d-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy" className="py-1 d-block">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/404" className="py-1 d-block">
                  Page Not Found
                </Link>
              </li>
              <li>
                <Link href="/500" className="py-1 d-block">
                  Server Error
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <h2 className="footer-heading">Have a Questions?</h2>
            <div className="block-23 mb-3">
              <ul>
                <li>
                  <span className="icon fa fa-map-marker"></span>
                  <span className="text">{SITE.address}</span>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <span className="icon fa fa-comment"></span>
                    <span className="text">+254 112 272 061</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>
                    <span className="icon fa fa-paper-plane"></span>
                    <span className="text">{SITE.email}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <p className="copyright">
              Copyright &copy; {new Date().getFullYear()} Noah Green, Nairobi.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
