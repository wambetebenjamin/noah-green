"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import {
  ContributionPieChart,
  MaterialBarChart,
  MonthlyLineChart,
} from "@/components/charts/ImpactCharts";
import type { publicImpactPayload } from "@/lib/mock/impact";
import { IMAGES } from "@/lib/images";

type ImpactPayload = ReturnType<typeof publicImpactPayload>;

const FACES = [
  IMAGES.portraitMaasaiManNairobi,
  IMAGES.portraitMaasaiManRural,
  IMAGES.portraitMaasaiWoman,
  IMAGES.portraitElderlyWoman,
];

export default function ImpactBoard() {
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
    return <div className="ng-stat-card">Loading the city impact board...</div>;
  }

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="ng-stat-card">
            <div className="ng-stat-value">
              <CountUp value={data.stats.totalHouseholdsEnrolled} />
            </div>
            <div className="ng-stat-label">households enrolled</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="ng-stat-card">
            <div className="ng-stat-value">
              <CountUp value={data.stats.kgDivertedAllTime} />
            </div>
            <div className="ng-stat-label">kg diverted from landfill</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="ng-stat-card">
            <div className="ng-stat-value">
              <CountUp value={data.stats.activeZones} />
            </div>
            <div className="ng-stat-label">active collection zones</div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-7 mb-4 mb-lg-0">
          <MaterialBarChart data={data.kgByMaterial} />
        </div>
        <div className="col-lg-5">
          <ContributionPieChart data={data.householdVsBusiness} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <MonthlyLineChart data={data.monthlyTotals} />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <span
            className="subheading d-block mb-3"
            style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
          >
            Faces of the programme
          </span>
          <div className="d-flex justify-content-center flex-wrap">
            {FACES.map((face) => (
              <Image
                key={face.local}
                src={face.local}
                alt={face.alt}
                width={96}
                height={96}
                className="rounded-circle mr-3 mb-3"
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
          <p style={{ color: "#808080", fontSize: 14 }}>
            {data.stats.treesPlanted} indigenous trees planted so far in Ngong
            Hills Forest, one for every 1000 points members give.
          </p>
        </div>
      </div>
    </>
  );
}
