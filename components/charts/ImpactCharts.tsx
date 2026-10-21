"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const AXIS = { fontSize: 12, fill: "#6c757d" };

export function MaterialBarChart({
  data,
}: {
  data: { name: string; kg: number; color: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="ng-chart-card"
    >
      <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
        Kilograms collected per material this month
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis
            dataKey="name"
            tick={AXIS}
            angle={-28}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis tick={AXIS} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Collected"]} />
          <Bar dataKey="kg" isAnimationActive animationDuration={1100} radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function MonthlyLineChart({ data }: { data: { month: string; kg: number }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="ng-chart-card"
    >
      <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
        Total kilograms collected per month, last 12 months
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis dataKey="month" tick={AXIS} />
          <YAxis tick={AXIS} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Collected"]} />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#2b98f0"
            strokeWidth={3}
            dot={{ fill: "#2b98f0", r: 3 }}
            isAnimationActive
            animationDuration={1400}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ContributionPieChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="ng-chart-card"
    >
      <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
        Household versus business contribution
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={95}
            paddingAngle={3}
            isAnimationActive
            animationDuration={1200}
            label={(entry) => `${entry.name} ${entry.value}%`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function AccountAreaChart({ data }: { data: { month: string; kg: number }[] }) {
  return (
    <div className="ng-chart-card">
      <h3 className="h5 mb-3" style={{ color: "#33313b" }}>
        Your kilograms collected per month
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis dataKey="month" tick={AXIS} />
          <YAxis tick={AXIS} />
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Recycled"]} />
          <Area
            type="monotone"
            dataKey="kg"
            stroke="#28a745"
            strokeWidth={3}
            fill="#28a745"
            fillOpacity={0.18}
            isAnimationActive
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
