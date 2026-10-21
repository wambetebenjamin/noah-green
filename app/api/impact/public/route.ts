import { NextResponse } from "next/server";
import { publicImpactPayload } from "@/lib/mock/impact";

export async function GET() {
  return NextResponse.json(publicImpactPayload(), {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
