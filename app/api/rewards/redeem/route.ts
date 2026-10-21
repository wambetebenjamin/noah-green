import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { computeBalance } from "@/lib/balance";
import { addRedemption } from "@/lib/store";
import { sendMail } from "@/lib/mailer";

export const REDEMPTION_RULES = {
  mpesa: { min: 500, step: 100, label: "M-Pesa cash out" },
  partner: { min: 300, step: 50, label: "Partner discount voucher" },
  tree: { min: 1000, step: 1000, label: "Tree planted in your name" },
} as const;

const schema = z.object({
  rewardType: z.enum(["mpesa", "partner", "tree"]),
  points: z.number().int().positive(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "rewardType and points are required", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const { rewardType, points } = parsed.data;
  const rule = REDEMPTION_RULES[rewardType];
  if (points < rule.min) {
    return NextResponse.json(
      { error: `${rule.label} needs at least ${rule.min} points` },
      { status: 422 }
    );
  }
  if (points % rule.step !== 0) {
    return NextResponse.json(
      { error: `${rule.label} redeems in steps of ${rule.step} points` },
      { status: 422 }
    );
  }
  const breakdown = await computeBalance(session.user.email);
  if (points > breakdown.balance) {
    return NextResponse.json(
      { error: `Not enough points. Your balance is ${breakdown.balance}.` },
      { status: 422 }
    );
  }
  const detail =
    rewardType === "mpesa"
      ? `M-Pesa cash out, KES ${Math.round(points / 2)} sent to your registered number`
      : rewardType === "tree"
        ? `${points / 1000} indigenous tree planted in Ngong Hills Forest in your name`
        : "Eco partner voucher issued to your account";
  const id = `RD-${Date.now().toString(36).toUpperCase()}`;
  await addRedemption({
    id,
    email: session.user.email.toLowerCase(),
    rewardType,
    points,
    createdAt: new Date().toISOString(),
    detail,
  });
  await sendMail({
    to: session.user.email,
    subject: `Noah Green redemption ${id}`,
    text: `You redeemed ${points} points for: ${detail}. New balance: ${breakdown.balance - points} points.`,
  });
  return NextResponse.json({ id, detail, newBalance: breakdown.balance - points });
}
