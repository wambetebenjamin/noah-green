"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Loader2, Trash2, TreePine } from "lucide-react";
import CountUp from "@/components/CountUp";
import { AccountAreaChart } from "@/components/charts/ImpactCharts";
import { materialByCode } from "@/lib/materials";
import type { MaterialCode } from "@/lib/materials";
import { seedImpactTotals } from "@/lib/mock/account";
import { downloadImpactReport } from "@/lib/pdf";

interface HistoryRow {
  ref: string;
  date: string;
  materials: { code: MaterialCode; kg: number }[];
  kgTotal: number;
  points: number;
  status: string;
}

interface Balance {
  earned: number;
  redeemed: number;
  balance: number;
  redemptions: {
    id: string;
    rewardType: string;
    points: number;
    createdAt: string;
    detail: string;
  }[];
}

const REWARD_OPTIONS = [
  { value: "mpesa", label: "M-Pesa cash out, minimum 500 points, steps of 100" },
  { value: "partner", label: "Partner discount voucher, minimum 300 points, steps of 50" },
  { value: "tree", label: "Tree planted in your name, 1000 points per tree" },
];

export default function AccountDashboard({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [rewardType, setRewardType] = useState<"mpesa" | "partner" | "tree">("mpesa");
  const [points, setPoints] = useState(500);
  const [redeemState, setRedeemState] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    const [balRes, histRes] = await Promise.all([
      fetch("/api/rewards/balance"),
      fetch("/api/pickups/history"),
    ]);
    if (balRes.ok) setBalance((await balRes.json()) as Balance);
    if (histRes.ok) {
      const data = (await histRes.json()) as { pickups: HistoryRow[] };
      setHistory(data.pickups);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const totals = useMemo(() => seedImpactTotals(email), [email]);
  const monthly = useMemo(() => {
    const buckets = new Map<string, number>();
    const now = new Date("2026-10-01");
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, 0);
    }
    history
      .filter((h) => h.status === "completed")
      .forEach((h) => {
        const key = h.date.slice(0, 7);
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + h.kgTotal);
      });
    return Array.from(buckets.entries()).map(([key, kg]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-KE", {
        month: "short",
      });
      return { month: `${label} ${y.slice(2)}`, kg };
    });
  }, [history]);

  const upcoming = history.filter((h) => h.status === "scheduled");
  const completed = history.filter((h) => h.status !== "scheduled");

  const cancelPickup = async (ref: string) => {
    setBusyRef(ref);
    const res = await fetch("/api/pickups/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickupRef: ref }),
    });
    setBusyRef(null);
    if (res.ok) await load();
  };

  const redeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemState(null);
    const res = await fetch("/api/rewards/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardType, points }),
    });
    const data = await res.json();
    if (res.ok) {
      setRedeemState({ msg: `Done. ${data.detail}`, ok: true });
      await load();
    } else {
      setRedeemState({ msg: data.error || "Redemption failed", ok: false });
    }
  };

  const exportReport = async () => {
    setExporting(true);
    try {
      await downloadImpactReport("ng-annual-report", `noah-green-impact-report-${email}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-4 mb-4">
        <div className="ng-chart-card text-center">
          <span className="subheading" style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
            Points balance
          </span>
          <div className="ng-stat-value">
            <CountUp value={balance?.balance ?? 0} />
          </div>
          <p style={{ fontSize: 13, color: "#6c757d" }}>
            Earned {balance?.earned ?? 0} lifetime, redeemed {balance?.redeemed ?? 0}
          </p>
          <form onSubmit={redeem} className="text-left mt-3">
            <div className="form-group">
              <label htmlFor="reward-type">Redeem for</label>
              <select
                id="reward-type"
                className="form-control"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value as "mpesa" | "partner" | "tree")}
              >
                {REWARD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reward-points">Points</label>
              <input
                id="reward-points"
                type="number"
                className="form-control"
                min={50}
                step={50}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value) || 0)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2">
              Redeem now
            </button>
            {redeemState ? (
              <p
                className="mt-2 mb-0"
                style={{ fontSize: 13, color: redeemState.ok ? "#28a745" : "#dc3545" }}
              >
                {redeemState.msg}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      <div className="col-lg-8 mb-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="ng-stat-card">
              <div className="ng-stat-value">
                <CountUp value={totals.totalKg} />
              </div>
              <div className="ng-stat-label">kg recycled all time</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="ng-stat-card">
              <div className="ng-stat-value">
                <CountUp value={totals.co2Kg} />
              </div>
              <div className="ng-stat-label">kg CO2 offset</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="ng-stat-card">
              <div className="ng-stat-value">
                <CountUp value={totals.trees} />
              </div>
              <div className="ng-stat-label">
                <TreePine size={14} className="mr-1" style={{ display: "inline" }} />
                trees planted
              </div>
            </div>
          </div>
        </div>
        <AccountAreaChart data={monthly} />
        <div className="text-right mt-3">
          <button
            type="button"
            className="btn btn-outline-primary py-2 px-3"
            onClick={exportReport}
            disabled={exporting}
          >
            {exporting ? <Loader2 size={14} className="mr-1" /> : <FileDown size={14} className="mr-1" />}
            Download annual impact report
          </button>
        </div>
      </div>

      <div className="col-lg-6 mb-4">
        <div className="ng-chart-card">
          <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
            Upcoming pickups
          </h3>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 14, color: "#808080" }}>
              Nothing scheduled yet, {name.split(" ")[0]}. Book your next round
              in under two minutes.
            </p>
          ) : (
            upcoming.map((row) => (
              <div className="ng-review-row" key={row.ref}>
                <span>
                  {row.date}, {row.materials.map((m) => materialByCode(m.code)?.name).join(", ")}
                </span>
                <span className="d-flex align-items-center">
                  <strong className="mr-2">{row.ref}</strong>
                  <button
                    type="button"
                    className="btn btn-outline-primary py-1 px-2"
                    style={{ fontSize: 11 }}
                    disabled={busyRef === row.ref}
                    onClick={() => cancelPickup(row.ref)}
                  >
                    <Trash2 size={12} className="mr-1" /> Cancel
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-lg-6 mb-4">
        <div className="ng-chart-card">
          <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
            Redemption history
          </h3>
          {(balance?.redemptions || []).length === 0 ? (
            <p style={{ fontSize: 14, color: "#808080" }}>
              No redemptions yet. Your points are growing.
            </p>
          ) : (
            (balance?.redemptions || []).map((r) => (
              <div className="ng-review-row" key={r.id}>
                <span>
                  {new Date(r.createdAt).toLocaleDateString("en-KE")} {r.detail}
                </span>
                <strong>-{r.points}</strong>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="ng-chart-card">
          <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
            Pickup history
          </h3>
          <div className="table-responsive">
            <table className="ng-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Materials</th>
                  <th>kg</th>
                  <th>Points</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {completed.slice(0, 14).map((row) => (
                  <tr key={row.ref}>
                    <td>{row.date}</td>
                    <td>{row.ref}</td>
                    <td>
                      {row.materials
                        .map((m) => `${materialByCode(m.code)?.name} ${m.kg}kg`)
                        .join(", ")}
                    </td>
                    <td>{row.kgTotal}</td>
                    <td>{row.points}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12 d-none" aria-hidden="true">
        <div id="ng-annual-report" style={{ background: "#fff", padding: 24 }}>
          <h2 style={{ color: "#33313b" }}>Noah Green annual impact report</h2>
          <p>Member: {name} ({email})</p>
          <p>Total kilograms recycled all time: {totals.totalKg} kg</p>
          <p>Carbon dioxide equivalent offset: {totals.co2Kg} kg</p>
          <p>Trees planted in your name: {totals.trees}</p>
          <p>Points balance: {balance?.balance ?? 0}</p>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Date</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Reference</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>kg</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {completed.slice(0, 24).map((row) => (
                <tr key={row.ref}>
                  <td style={{ borderBottom: "1px solid #eee" }}>{row.date}</td>
                  <td style={{ borderBottom: "1px solid #eee" }}>{row.ref}</td>
                  <td style={{ borderBottom: "1px solid #eee" }}>{row.kgTotal}</td>
                  <td style={{ borderBottom: "1px solid #eee" }}>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
