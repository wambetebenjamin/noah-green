import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { computeBalance } from "@/lib/balance";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }
  const breakdown = await computeBalance(session.user.email);
  return NextResponse.json(breakdown);
}
