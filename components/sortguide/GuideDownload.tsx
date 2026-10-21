"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { downloadSortGuide, guideSectionsFromMaterials } from "@/lib/pdf";
import { GUIDE_EXTRA } from "@/lib/sort-guide-copy";

export default function GuideDownload() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-primary py-3 px-4"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          downloadSortGuide(guideSectionsFromMaterials(GUIDE_EXTRA));
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? <Loader2 size={14} className="mr-1" /> : <FileDown size={14} className="mr-1" />}
      Download printable guide (PDF)
    </button>
  );
}
