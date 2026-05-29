import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
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
      <p style={{ color: "#f43f5e", fontWeight: 700 }}>
        Saldo: {formatARS(payload[0].value)}
      </p>
      {payload[0].payload.pago > 0 && (
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 2 }}>
          Pago: {formatARS(payload[0].payload.pago)}
        </p>
      )}
    </div>
  );
};

const DebtEvolutionChart = ({ data, deudaInicial }) => {
  // Hide individual dots when there are many data points to avoid clutter
  const showDots = data.length <= 15;

  // Only start skipping labels when there are many points; up to ~12 show all
  const xInterval = data.length <= 12 ? 0 : Math.max(0, Math.ceil(data.length / 6) - 1);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 28 }}>
        <defs>
          <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={deudaInicial / 2}
          stroke="rgba(99,102,241,0.3)"
          strokeDasharray="4 4"
          label={{ value: "50%", fill: "#6366f1", fontSize: 10, position: "insideTopRight" }}
        />
        <Area
          type="monotone"
          dataKey="saldo"
          stroke="#f43f5e"
          strokeWidth={2.5}
          fill="url(#saldoGrad)"
          dot={showDots ? { fill: "#f43f5e", r: 4, strokeWidth: 0 } : false}
          activeDot={{ r: 6, fill: "#f43f5e", stroke: "#1a1d27", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DebtEvolutionChart;
