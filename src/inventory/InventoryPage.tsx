import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function InventoryPage() {
  //const vodox = "76561198102036162";
  const opaxx = "76561198078812689";

  const [steamId, setSteamId] = useState<string>(opaxx);
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
      <div className={"container mx-auto"}>
        <Outlet />
      </div>
    </div>
  );
}

export default InventoryPage;
