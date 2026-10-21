"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      className="ng-fab ng-fab-whatsapp"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-tooltip="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
