import nodemailer from "nodemailer";

function configured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!configured()) {
    // No SMTP credentials in this environment. The mail is logged instead so
    // the flow stays observable during development and CI.
    console.info("[noah-green:mail] skipped, no SMTP configured", {
      to: opts.to,
      subject: opts.subject,
    });
    return { sent: false, reason: "smtp-not-configured" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Noah Green <hello@noahgreen.co.ke>",
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return { sent: true };
  } catch (err) {
    console.error("[noah-green:mail] failed", err);
    return { sent: false, reason: "smtp-error" };
  }
}
