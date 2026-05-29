import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const formatARS = (val) =>
  val.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a1d27",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: "0.8rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>{label}</p>
      <p style={{ color: "#22c55e", fontWeight: 700 }}>
        {formatARS(payload[0].value)}
      </p>
    </div>
  );
};

const COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#38bdf8", "#0ea5e9"];

const PaymentsBarChart = ({ data }) => {
  // Clamp bar width: wide with few payments, narrow with many
  const barSize = Math.max(8, Math.min(28, Math.floor(300 / data.length)));

  // Only start skipping labels when there are many bars; up to ~12 show all
  const xInterval = data.length <= 12 ? 0 : Math.max(0, Math.ceil(data.length / 8) - 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 28 }} barSize={barSize}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="fechaCorta"
          tick={{ fill: "#475569", fontSize: 11, angle: -40, textAnchor: "end", dy: 6 }}
          axisLine={false}
          tickLine={false}
          interval={xInterval}
          height={48}
        />
        <YAxis
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="pago" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PaymentsBarChart;
