import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <div className={"min-w-screen min-h-screen dark:bg-slate-950"}>
      <App />
    </div>
  </BrowserRouter>
);
