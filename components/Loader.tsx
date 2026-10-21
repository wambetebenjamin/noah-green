"use client";

import { useEffect, useState } from "react";

/**
 * Loading screen reproduced from the zip template: index.html line 816 and
 * css/style.css #ftco-loader rules. The branded recycling loop drawn in
 * three strokes is the Noah Green addition on top.
 */
export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="ftco-loader"
      className={show ? "show fullscreen" : "fullscreen"}
      aria-hidden={!show}
    >
      <svg className="circular" width="48px" height="48px">
        <circle
          className="path-bg"
          cx="24"
          cy="24"
          r="22"
          fill="none"
          strokeWidth="4"
          stroke="#eeeeee"
        />
        <circle
          className="path"
          cx="24"
          cy="24"
          r="22"
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          stroke="#F96D00"
        />
      </svg>
      <svg className="ng-recycle-loop" viewBox="0 0 64 64" role="presentation">
        <path d="M32 7 L49 37 l-9 -2 m9 2 l2 -9" />
        <path d="M49 37 L15 37 l8 -6 m-8 6 l8 6" />
        <path d="M15 37 L32 7 l-2 9 m2 -9 l-9 2" />
      </svg>
      <div className="ng-loader-brand">Noah Green</div>
    </div>
  );
}
