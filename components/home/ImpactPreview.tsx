"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/CountUp";
import {
  ContributionPieChart,
  MaterialBarChart,
} from "@/components/charts/ImpactCharts";
import type { publicImpactPayload } from "@/lib/mock/impact";

type ImpactPayload = ReturnType<typeof publicImpactPayload>;

export default function ImpactPreview() {
  const [data, setData] = useState<ImpactPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/impact/public")
      .then((res) => res.json())
      .then((payload: ImpactPayload) => {
        if (alive) setData(payload);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="ng-stat-card">Loading city impact numbers...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row ftco-counter py-5" id="section-counter">
        <div className="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
          <div className="block-18">
            <div className="text">
              <strong className="number">
                <CountUp value={data.stats.totalKgThisMonth} />
              </strong>
            </div>
            <div className="text">
              <span>
                kg collected <br />
                this month
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
          <div className="block-18">
            <div className="text">
              <strong className="number">
                <CountUp value={data.stats.co2OffsetKg} />
              </strong>
            </div>
            <div className="text">
              <span>
                kg CO2 equivalent <br />
                offset
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
          <div className="block-18">
            <div className="text">
              <strong className="number">
                <CountUp value={data.stats.waterSavedLitres} />
              </strong>
            </div>
            <div className="text">
              <span>
                litres of water <br />
                saved
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
          <div className="block-18">
            <div className="text">
              <strong className="number">
                <CountUp value={data.stats.activeHouseholds} />
              </strong>
            </div>
            <div className="text">
              <span>
                active <br />
                households
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 mb-4 mb-lg-0">
          <MaterialBarChart data={data.kgByMaterial} />
        </div>
        <div className="col-lg-5">
          <ContributionPieChart data={data.householdVsBusiness} />
        </div>
      </div>
    </>
  );
}
