"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { MATERIALS, materialByCode, pointsPerKg } from "@/lib/materials";
import { SITE } from "@/lib/constants";

function header(doc: jsPDF, title: string): number {
  doc.setFillColor(43, 152, 240);
  doc.rect(0, 0, 210, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("NOAH GREEN", 14, 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(SITE.tagline, 14, 19);
  doc.setTextColor(51, 49, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Generated ${new Date().toLocaleString("en-KE")}`, 14, 45);
  doc.setTextColor(51, 49, 59);
  return 54;
}

function ensureSpace(doc: jsPDF, y: number, needed = 18): number {
  if (y > 280 - needed) {
    doc.addPage();
    return 20;
  }
  return y;
}

export interface SummaryPickup {
  ref: string;
  name: string;
  accountType: string;
  date: string;
  slot: string;
  zone: string;
  address: string;
  gateNotes: string;
  materials: { code: string; kg: number }[];
  estimatedPoints: number;
}

export function downloadPickupSummary(pickup: SummaryPickup): void {
  const doc = new jsPDF();
  let y = header(doc, "Pickup Summary");
  doc.setFontSize(11);
  const rows: [string, string][] = [
    ["Pickup reference", pickup.ref],
    ["Account", `${pickup.name} (${pickup.accountType})`],
    ["Date", pickup.date],
    ["Time slot", pickup.slot],
    ["Zone", pickup.zone],
    ["Address", pickup.address],
    ["Gate notes", pickup.gateNotes || "None"],
    ["Estimated points", `${pickup.estimatedPoints} points`],
  ];
  rows.forEach(([label, value]) => {
    y = ensureSpace(doc, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(value, 130) as string[];
    doc.text(wrapped, 60, y);
    y += 7 * wrapped.length + 2;
  });
  y += 4;
  y = ensureSpace(doc, y);
  doc.setFont("helvetica", "bold");
  doc.text("Materials scheduled", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  pickup.materials.forEach((line) => {
    y = ensureSpace(doc, y);
    const info = materialByCode(line.code as never);
    doc.text(
      `${info ? info.name : line.code}: ${line.kg} kg at ${pointsPerKg(line.code as never)} points per kg`,
      18,
      y
    );
    y += 7;
  });
  y += 6;
  y = ensureSpace(doc, y);
  doc.setTextColor(110, 110, 110);
  doc.text(
    "Sort your materials into the colour coded categories before the team arrives.",
    14,
    y
  );
  doc.text(`Questions? WhatsApp +254 112 272 061 or ${SITE.email}`, 14, y + 6);
  doc.save(`noah-green-pickup-${pickup.ref}.pdf`);
}

export async function downloadImpactReport(
  elementId: string,
  fileName: string
): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) return;
  const canvas = await html2canvas(node, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });
  const doc = new jsPDF("p", "mm", "a4");
  const startY = header(doc, "Annual Impact Report");
  const pageWidth = 182;
  const pxPerMm = canvas.width / pageWidth;
  const firstPageHeightMm = 280 - startY;
  const laterPageHeightMm = 275;

  let sourceY = 0;
  let first = true;
  while (sourceY < canvas.height) {
    const heightMm = first ? firstPageHeightMm : laterPageHeightMm;
    const chunkPx = Math.min(
      Math.floor(heightMm * pxPerMm),
      canvas.height - sourceY
    );
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = chunkPx;
    const ctx = slice.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      chunkPx,
      0,
      0,
      canvas.width,
      chunkPx
    );
    doc.addImage(
      slice.toDataURL("image/png"),
      "PNG",
      14,
      first ? startY : 15,
      pageWidth,
      chunkPx / pxPerMm,
      undefined,
      "FAST"
    );
    sourceY += chunkPx;
    first = false;
    if (sourceY < canvas.height) doc.addPage();
  }
  doc.save(fileName);
}

export interface GuideSection {
  name: string;
  accepted: string[];
  rejected: string[];
  mistakes: string;
  why: string;
}

export function downloadSortGuide(sections: GuideSection[]): void {
  const doc = new jsPDF();
  let y = header(doc, "Sorting Guide, plain Kenyan English");
  sections.forEach((section) => {
    y = ensureSpace(doc, y, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(43, 152, 240);
    doc.text(section.name, 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(51, 49, 59);
    doc.setFont("helvetica", "bold");
    doc.text("What goes in", 18, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    section.accepted.forEach((line) => {
      y = ensureSpace(doc, y);
      const wrapped = doc.splitTextToSize(`- ${line}`, 176) as string[];
      doc.text(wrapped, 22, y);
      y += 5 * wrapped.length + 1;
    });
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("What does not go in", 18, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    section.rejected.forEach((line) => {
      y = ensureSpace(doc, y);
      const wrapped = doc.splitTextToSize(`- ${line}`, 176) as string[];
      doc.text(wrapped, 22, y);
      y += 5 * wrapped.length + 1;
    });
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Common mistakes", 18, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const mistakeLines = doc.splitTextToSize(section.mistakes, 176) as string[];
    mistakeLines.forEach((line) => {
      y = ensureSpace(doc, y);
      doc.text(line, 22, y);
      y += 5;
    });
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Why it matters", 18, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const whyLines = doc.splitTextToSize(section.why, 176) as string[];
    whyLines.forEach((line) => {
      y = ensureSpace(doc, y);
      doc.text(line, 22, y);
      y += 5;
    });
    y += 8;
  });
  doc.setTextColor(110, 110, 110);
  y = ensureSpace(doc, y);
  doc.text(`${SITE.name}, ${SITE.tagline} WhatsApp +254 112 272 061`, 14, y);
  doc.save("noah-green-sorting-guide.pdf");
}

export const GUIDE_MATERIAL_EXTRA: Record<string, { mistakes: string; why: string }> = {};

export function guideSectionsFromMaterials(
  extra: Record<string, { mistakes: string; why: string }>
): GuideSection[] {
  return MATERIALS.map((m) => ({
    name: m.name,
    accepted: m.accepted,
    rejected: m.rejected,
    mistakes: extra[m.code]?.mistakes || "",
    why: extra[m.code]?.why || "",
  }));
}
