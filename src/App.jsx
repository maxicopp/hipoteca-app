
import React, { useEffect, useState } from "react";
import HipotecaCard from "./components/HipotecaCard";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/src/data/hipoteca.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="app-bg-responsive">
      {data ? (
        <HipotecaCard
          deudaInicial={data.deudaInicial}
          pagos={data.pagos}
        />
      ) : (
        <div style={{ color: "#888", fontSize: "1.2rem" }}>Cargando datos...</div>
      )}
    </div>
  );
}

export default App;
