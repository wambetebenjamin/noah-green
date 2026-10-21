import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listPickups } from "@/lib/store";
import { seedHistory } from "@/lib/mock/account";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }
  const email = session.user.email;
  const [live, seeded] = await Promise.all([
    listPickups(email),
    Promise.resolve(seedHistory(email)),
  ]);
  const completedSeeded = seeded.map((s) => ({
    ref: s.ref,
    date: s.date,
    materials: s.materials,
    kgTotal: s.kgTotal,
    points: s.points,
    status: "completed" as const,
    source: "history" as const,
  }));
  const liveMapped = live.map((p) => ({
    ref: p.ref,
    date: p.date,
    materials: p.materials,
    kgTotal: p.materials.reduce((s, m) => s + m.kg, 0),
    points: p.estimatedPoints,
    status: p.status,
    source: "live" as const,
  }));
  const combined = [...liveMapped, ...completedSeeded].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
  return NextResponse.json({ pickups: combined });
}
