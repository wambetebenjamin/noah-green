import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPickup } from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }
  const { ref } = await context.params;
  const pickup = await getPickup(ref);
  if (!pickup) {
    return NextResponse.json({ error: "Pickup not found" }, { status: 404 });
  }
  if (pickup.email !== session.user.email.toLowerCase()) {
    return NextResponse.json({ error: "Not your pickup" }, { status: 403 });
  }
  return NextResponse.json(pickup);
}
