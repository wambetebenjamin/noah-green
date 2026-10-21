"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarPlus, Download, FileDown, MessageCircle } from "lucide-react";
import QRCode from "qrcode";
import { materialByCode } from "@/lib/materials";
import type { MaterialCode } from "@/lib/materials";
import { SITE, WHATSAPP_URL } from "@/lib/constants";
import { downloadPickupSummary } from "@/lib/pdf";

interface ConfirmationData {
  ref: string;
  name: string;
  accountType: string;
  date: string;
  slot: string;
  zone: string;
  address: string;
  gateNotes: string;
  materials: { code: MaterialCode; kg: number }[];
  estimatedPoints: number;
}

function slotToTimes(slot: string): { start: string; end: string } {
  const [start, end] = slot.split(" to ");
  return { start: start || "08:00", end: end || "10:00" };
}

function calendarLink(data: ConfirmationData): string {
  const { start, end } = slotToTimes(data.slot);
  // Nairobi is UTC+3. Convert the local slot to UTC for the calendar link.
  const startUtc = new Date(`${data.date}T${start}:00+03:00`);
  const endUtc = new Date(`${data.date}T${end}:00+03:00`);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = encodeURIComponent(
    `Noah Green pickup ${data.ref}. Materials: ${data.materials
      .map((m) => `${materialByCode(m.code)?.name} ${m.kg}kg`)
      .join(", ")}. Sort everything into colour coded categories before the team arrives.`
  );
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`Noah Green pickup ${data.ref}`)}` +
    `&dates=${fmt(startUtc)}/${fmt(endUtc)}` +
    `&details=${details}` +
    `&location=${encodeURIComponent(`${data.address}, ${data.zone}, Nairobi`)}`
  );
}

export default function ConfirmationClient({ refParam }: { refParam: string }) {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SITE.lastPickupKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ConfirmationData;
        if (!refParam || parsed.ref === refParam) setData(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [refParam]);

  useEffect(() => {
    if (!data) return;
    QRCode.toDataURL(
      `${SITE.name} pickup ${data.ref} on ${data.date} ${data.slot}`,
      { width: 180, margin: 1 }
    )
      .then(setQr)
      .catch(() => undefined);
  }, [data]);

  const totalKg = useMemo(
    () => (data ? data.materials.reduce((s, m) => s + m.kg, 0) : 0),
    [data]
  );

  if (!data) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <p style={{ color: "#808080" }}>
            We could not find the pickup details in this browser session.
            Check your confirmation email, or schedule a new pickup below.
          </p>
          <Link href="/schedule" className="btn btn-primary py-3 px-4">
            Schedule a Pickup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="ng-chart-card" id="pickup-summary-card">
          <div className="d-flex flex-wrap justify-content-between align-items-start mb-4">
            <div>
              <span className="subheading" style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                Pickup confirmed
              </span>
              <h2 className="mb-1" style={{ color: "#33313b" }}>
                Reference {data.ref}
              </h2>
              <p className="mb-0" style={{ color: "#808080", fontSize: 14 }}>
                A confirmation email is on its way to you. Keep this reference
                for WhatsApp support.
              </p>
            </div>
            {qr ? (
              <Image
                src={qr}
                alt={`QR code for pickup ${data.ref}`}
                width={120}
                height={120}
                unoptimized
              />
            ) : null}
          </div>

          <div className="ng-review-row">
            <span>Account</span>
            <strong>
              {data.name}, {data.accountType}
            </strong>
          </div>
          <div className="ng-review-row">
            <span>Date and slot</span>
            <strong>
              {data.date}, {data.slot}
            </strong>
          </div>
          <div className="ng-review-row">
            <span>Address</span>
            <strong>
              {data.zone}, {data.address}
            </strong>
          </div>
          {data.gateNotes ? (
            <div className="ng-review-row">
              <span>Gate notes</span>
              <strong>{data.gateNotes}</strong>
            </div>
          ) : null}
          <div className="ng-review-row">
            <span>Materials</span>
            <strong>
              {data.materials
                .map((m) => `${materialByCode(m.code)?.name} ${m.kg}kg`)
                .join(", ")}
            </strong>
          </div>
          <div className="ng-review-row">
            <span>Total weight</span>
            <strong>{totalKg} kg</strong>
          </div>
          <div className="ng-review-row">
            <span>Estimated points to earn</span>
            <strong>
              <span className="ng-points-chip">{data.estimatedPoints} points</span>
            </strong>
          </div>

          <div className="d-flex flex-wrap mt-4">
            <a
              href={calendarLink(data)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary py-2 px-3 mr-2 mb-2"
            >
              <CalendarPlus size={14} className="mr-1" /> Add to Google Calendar
            </a>
            <button
              type="button"
              className="btn btn-primary py-2 px-3 mr-2 mb-2"
              onClick={() => downloadPickupSummary(data)}
            >
              <FileDown size={14} className="mr-1" /> Download Summary PDF
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn ng-btn-yellow py-2 px-3 mr-2 mb-2"
            >
              <MessageCircle size={14} className="mr-1" /> WhatsApp us
            </a>
            <Link href="/sort-guide" className="btn btn-outline-primary py-2 px-3 mb-2">
              <Download size={14} className="mr-1" /> Sorting guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
