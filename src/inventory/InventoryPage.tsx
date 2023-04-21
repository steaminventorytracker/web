import React, { useState } from "react";
import Inventory from "./Inventory";
import { Route, Routes, useNavigate } from "react-router-dom";
import Job from "./job/Job";

function InventoryPage() {
  const vodox = "76561198102036162";
  //const opaxx = "76561198078812689";

  const [steamId, setSteamId] = useState<string>(vodox);
  const navigate = useNavigate();

  return (
    <div className={""}>
      <div className={"flex h-40 items-center justify-center"}>
        <input
          className={"rounded-l p-2 dark:bg-slate-700 dark:text-white"}
          type="text"
          onChange={(e) => setSteamId(e.target.value)}
          value={steamId}
          id=""
        />
        <button
          onClick={() => navigate(`/inventory/${steamId}`)}
          className={"rounded-r p-2 dark:bg-slate-400"}
          type={"submit"}
        >
          fetch
        </button>
      </div>
      <div>
        <div></div>
      </div>
      <div className={"flex flex-col items-center"}>
        <Routes>
          <Route path="inventory/:steamId" element={<Inventory />} />
          <Route path="job/:jobId" element={<Job />} />
        </Routes>
      </div>
    </div>
  );
}

export default InventoryPage;
