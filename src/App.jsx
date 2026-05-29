import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/hipoteca.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="app-layout">
      {data ? (
        <Dashboard deudaInicial={data.deudaInicial} pagos={data.pagos} />
      ) : (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
          gap: "0.5rem"
        }}>
          <span>Cargando datos…</span>
        </div>
      )}
    </div>
  );
}

export default App;
