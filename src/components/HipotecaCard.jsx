import React from "react";
import "./HipotecaCard.css";
import torresImg from "../assets/torres.png";


const formatoARS = (valor) =>
  valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const HipotecaCard = ({ deudaInicial, pagos }) => {
  const totalPagos = pagos.reduce((acc, pago) => acc + pago.monto, 0);
  const pendiente = deudaInicial - totalPagos;
  // Ordenar pagos de más reciente a más viejo (por fecha dd/mm)
  const pagosOrdenados = [...pagos].sort((a, b) => {
    // Soporta formato dd/mm/yyyy
    const [da, ma, ya] = a.fecha.split("/").map(Number);
    const [db, mb, yb] = b.fecha.split("/").map(Number);
    // Compara por año, luego mes, luego día (mayor primero)
    if (yb !== ya) return yb - ya;
    if (mb !== ma) return mb - ma;
    return db - da;
  });
  return (
    <div className="hipoteca-card hipoteca-card-modern">
      <div className="hipoteca-header">
        <span className="icono-casa">
          <img src={torresImg} alt="Torres" className="icono-torres" />
        </span>
        <h2>Resumen Torres Pueyrredón</h2>
      </div>
      <div className="hipoteca-info">
        <div>
          <span className="label">Deuda inicial</span>
          <span className="value">{formatoARS(deudaInicial)}</span>
        </div>
        <div>
          <span className="label">Total pagos</span>
          <span className="value value-pagos">{formatoARS(totalPagos)}</span>
        </div>
        <div>
          <span className="label">Pendiente</span>
          <span className="value pendiente">{formatoARS(pendiente)}</span>
        </div>
      </div>
      <h3 className="pagos-title">Pagos recibidos</h3>
      <div className="pagos-list">
        {pagosOrdenados.map((pago, idx) => (
          <div className="pago-item pago-item-modern" key={idx}>
            <span className="fecha">{pago.fecha}</span>
            <span className="monto">{formatoARS(pago.monto)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HipotecaCard;
