import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cancelPickup } from "@/lib/store";
import { sendMail } from "@/lib/mailer";

const schema = z.object({ pickupRef: z.string().min(3) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "pickupRef is required" }, { status: 422 });
  }
  const ok = await cancelPickup(parsed.data.pickupRef, session.user.email);
  if (!ok) {
    return NextResponse.json(
      { error: "Pickup not found, not yours, or not cancellable" },
      { status: 404 }
    );
  }
  await sendMail({
    to: session.user.email,
    subject: `Noah Green pickup ${parsed.data.pickupRef} cancelled`,
    text: `Your pickup ${parsed.data.pickupRef} has been cancelled. Schedule a new one any time at noahgreen.co.ke/schedule.`,
  });
  return NextResponse.json({ cancelled: true, ref: parsed.data.pickupRef });
}
