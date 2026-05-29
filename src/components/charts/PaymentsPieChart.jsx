import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatARS = (val) =>
  val.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{
      background: "#1a1d27",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: "0.8rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: item.payload.color, fontWeight: 700 }}>{item.name}</p>
      <p style={{ color: "#f1f5f9", marginTop: 2 }}>{formatARS(item.value)}</p>
      <p style={{ color: "#94a3b8", marginTop: 2 }}>{item.payload.pct}%</p>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: entry.color, flexShrink: 0
          }} />
          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const PaymentsPieChart = ({ pagado, pendiente }) => {
  const total = pagado + pendiente;
  const data = [
    {
      name: "Pagado",
      value: pagado,
      color: "#22c55e",
      pct: ((pagado / total) * 100).toFixed(1),
    },
    {
      name: "Por cancelar",
      value: pendiente,
      color: "#0ea5e9",
      pct: ((pendiente / total) * 100).toFixed(1),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="45%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          content={renderLegend}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentsPieChart;
