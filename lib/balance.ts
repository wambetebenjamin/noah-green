import { listPickups, listRedemptions } from "@/lib/store";
import { seedHistory, seedRedemptions } from "@/lib/mock/account";

export interface BalanceBreakdown {
  earned: number;
  redeemed: number;
  balance: number;
  redemptions: {
    id: string;
    rewardType: "mpesa" | "partner" | "tree";
    points: number;
    createdAt: string;
    detail: string;
  }[];
}

export async function computeBalance(email: string): Promise<BalanceBreakdown> {
  const key = email.toLowerCase();
  const [livePickups, liveRedemptions] = await Promise.all([
    listPickups(key),
    listRedemptions(key),
  ]);
  const seeded = seedHistory(key);
  const earned =
    seeded.reduce((sum, h) => sum + h.points, 0) +
    livePickups
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.estimatedPoints, 0);
  const seededRedemptions = seedRedemptions(key);
  const redeemed =
    seededRedemptions.reduce((sum, r) => sum + r.points, 0) +
    liveRedemptions.reduce((sum, r) => sum + r.points, 0);
  return {
    earned,
    redeemed,
    balance: earned - redeemed,
    redemptions: [
      ...liveRedemptions.map((r) => ({
        id: r.id,
        rewardType: r.rewardType,
        points: r.points,
        createdAt: r.createdAt,
        detail: r.detail,
      })),
      ...seededRedemptions,
    ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  };
}
