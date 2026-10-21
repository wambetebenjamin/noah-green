"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { SITE, WHATSAPP_URL } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/impact", label: "Impact" },
  { href: "/rewards", label: "Rewards" },
  { href: "/sort-guide", label: "Sort Guide" },
  { href: "/corporate", label: "Corporate" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-12 col-md d-flex align-items-center">
              <p className="mb-0 phone">
                <span className="mailus">WhatsApp:</span>{" "}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  +254 112 272 061
                </a>{" "}
                or <span className="mailus">email us:</span>{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
            <div className="col-12 col-md d-flex justify-content-md-end">
              <div className="social-media">
                <p className="mb-0 d-flex">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    aria-label="Noah Green on WhatsApp"
                  >
                    <span className="fa fa-comment">
                      <i className="sr-only">WhatsApp</i>
                    </span>
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    aria-label="Noah Green on Facebook"
                  >
                    <span className="fa fa-facebook">
                      <i className="sr-only">Facebook</i>
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    aria-label="Noah Green on Instagram"
                  >
                    <span className="fa fa-instagram">
                      <i className="sr-only">Instagram</i>
                    </span>
                  </a>
                  <a
                    href="https://www.x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    aria-label="Noah Green on X"
                  >
                    <span className="fa fa-twitter">
                      <i className="sr-only">X</i>
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav
        className={`navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light${
          scrolled ? " ng-scrolled" : ""
        }`}
        id="ftco-navbar"
      >
        <div className="container">
          <Link className="navbar-brand" href="/">
            Noah<span>Green</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="ftco-nav"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="fa fa-bars"></span> Menu
          </button>
          <div className={`collapse navbar-collapse${open ? " show" : ""}`} id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              {NAV.map((item) => (
                <li
                  key={item.href}
                  className={`nav-item${pathname === item.href ? " active" : ""}`}
                >
                  <Link
                    href={item.href}
                    className="nav-link"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                {status === "authenticated" ? (
                  <span className="d-flex align-items-center">
                    <Link href="/my-account" className="nav-link">
                      My Account
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary py-2 px-3 ml-2"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign out
                    </button>
                  </span>
                ) : (
                  <span className="d-flex align-items-center">
                    <Link href="/auth/signin" className="nav-link">
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="btn btn-primary py-2 px-3 ml-2"
                      onClick={() => setOpen(false)}
                    >
                      Join the Programme
                    </Link>
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
