import React, { useMemo } from "react";
import torresImg from "../assets/torres.png";
import DebtEvolutionChart from "./charts/DebtEvolutionChart";
import PaymentsBarChart from "./charts/PaymentsBarChart";
import PaymentsPieChart from "./charts/PaymentsPieChart";

// ── helpers ──────────────────────────────────────────────────────────────────
const parseDate = (str) => {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
};

const formatARS = (val) =>
  val.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatDate = (str) => {
  const [d, m, y] = str.split("/");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

// ── component ─────────────────────────────────────────────────────────────────
const Dashboard = ({ deudaInicial, pagos }) => {
  const pagosOrdenados = useMemo(
    () => [...pagos].sort((a, b) => parseDate(a.fecha) - parseDate(b.fecha)),
    [pagos]
  );

  const totalPagado = useMemo(
    () => pagosOrdenados.reduce((acc, p) => acc + p.monto, 0),
    [pagosOrdenados]
  );

  const pendiente = deudaInicial - totalPagado;
  const progreso = (totalPagado / deudaInicial) * 100;

  // Build running balance series for charts
  const saldoSeries = useMemo(() => {
    let saldo = deudaInicial;
    const series = [{ fecha: "Inicio", saldo: deudaInicial, pago: 0 }];
    pagosOrdenados.forEach((p) => {
      saldo -= p.monto;
      series.push({ fecha: formatDate(p.fecha), saldo, pago: p.monto });
    });
    return series;
  }, [pagosOrdenados, deudaInicial]);

  // Pagos desc for table
  const pagosDesc = useMemo(() => [...pagosOrdenados].reverse(), [pagosOrdenados]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <img src={torresImg} alt="Torres Pueyrredón" className="header-avatar" />
        <div className="header-text">
          <h1>Torres Pueyrredón</h1>
          <p>Registro de pagos</p>
        </div>
      </header>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Deuda inicial</span>
          <span className="kpi-value primary">{formatARS(deudaInicial)}</span>
          <span className="kpi-sub">Capital original</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Total pagado</span>
          <span className="kpi-value success">{formatARS(totalPagado)}</span>
          <span className="kpi-sub">{pagosOrdenados.length} pagos realizados</span>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-fill" style={{ width: `${progreso}%` }} />
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Saldo pendiente</span>
          <span className="kpi-value danger">{formatARS(pendiente)}</span>
          <span className="kpi-sub">{progreso.toFixed(1)}% cancelado</span>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-grid">
        <div className="chart-card full-width">
          <div>
            <p className="chart-title">Evolución del saldo</p>
            <p className="chart-subtitle">Deuda restante después de cada pago</p>
          </div>
          <DebtEvolutionChart data={saldoSeries} deudaInicial={deudaInicial} />
        </div>

        <div className="chart-card">
          <div>
            <p className="chart-title">Pagos por período</p>
            <p className="chart-subtitle">Monto abonado en cada cuota</p>
          </div>
          <PaymentsBarChart data={saldoSeries.slice(1)} />
        </div>

        <div className="chart-card">
          <div>
            <p className="chart-title">Composición de la deuda</p>
            <p className="chart-subtitle">Pagado vs. pendiente</p>
          </div>
          <PaymentsPieChart pagado={totalPagado} pendiente={pendiente} />
        </div>
      </section>

      {/* Payments table */}
      <section className="payments-card">
        <div className="payments-header">
          <h2>Historial de pagos</h2>
          <span className="payments-count">{pagosOrdenados.length} pagos</span>
        </div>

        <div className="payments-table-head">
          <span>#</span>
          <span>Fecha</span>
          <span>Monto</span>
          <span>Saldo restante</span>
        </div>

        <div className="payments-table-body">
          {pagosDesc.map((pago, idx) => {
            const num = pagosDesc.length - idx;
            const saldoEntry = saldoSeries[num];
            return (
              <div className="payment-row" key={idx}>
                <span className="payment-num">#{num}</span>
                <span className="payment-date">{formatDate(pago.fecha)}</span>
                <span className="payment-amount">{formatARS(pago.monto)}</span>
                <span className="payment-balance">
                  {saldoEntry ? formatARS(saldoEntry.saldo) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <p className="app-footer">Actualizado al {formatDate(pagosOrdenados[pagosOrdenados.length - 1]?.fecha ?? "")}</p>
    </div>
  );
};

export default Dashboard;
