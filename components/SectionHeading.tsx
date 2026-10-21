interface SectionHeadingProps {
  subheading: string;
  title: string;
  intro?: string;
  white?: boolean;
  align?: "center" | "left";
}

/** Reproduces the zip heading-section pattern: small caps kicker plus h2. */
export default function SectionHeading({
  subheading,
  title,
  intro,
  white = false,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`col-md-8 heading-section ftco-animate${
        white ? " heading-section-white" : ""
      }${align === "center" ? " text-center" : ""}`}
    >
      <span className="subheading">{subheading}</span>
      <h2 className="mb-4">{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
