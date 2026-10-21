"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "When do points land in my account?",
    a: "The team weighs every bag at your gate and logs it on the spot. Points appear in your account the same evening, usually before 8pm.",
  },
  {
    q: "What is the smallest M-Pesa cash out?",
    a: "500 points, which sends KES 250 to the number on your account. Cash outs run in steps of 100 points and arrive within one working day.",
  },
  {
    q: "Do points expire?",
    a: "No. Points stay on your account as long as the account is active. If you move house inside our zones, your balance moves with you.",
  },
  {
    q: "Can I give my points to a school or a neighbour?",
    a: "Yes. WhatsApp us the reference of the account you want to gift and we transfer the points the same day. Gifting is how several estates fund their tree days.",
  },
  {
    q: "How does tree planting work?",
    a: "Every 1000 points plants one indigenous seedling in Ngong Hills Forest with our county partners. You get the planting date and a photo of your tree by email.",
  },
  {
    q: "My pickup was weighed but points are missing. What now?",
    a: "Message us on WhatsApp with your pickup reference. We reconcile weights against the truck log within 24 hours and credit any missing points.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {FAQS.map((item, index) => (
        <div className="ng-faq-item" key={item.q}>
          <button
            type="button"
            className="ng-faq-q"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? null : index)}
          >
            {item.q}
            <ChevronDown
              size={18}
              style={{
                transform: open === index ? "rotate(180deg)" : "none",
                transition: "transform .2s ease",
                flex: "none",
              }}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === index ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="ng-faq-a">{item.a}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
