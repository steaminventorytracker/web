import React, { useCallback, useMemo, useState } from "react";
import { InventoryResponse, JobResponse } from "../types/api";
import Inventory from "./Inventory";
import Job from "./job/Job";

function InventoryPage() {
  const [data, setData] = useState<null | InventoryResponse | JobResponse>(
    null
  );

  const vodox = "76561198102036162";
  const opaxx = "76561198078812689";

  const [steamId, setSteamId] = useState<string>(opaxx);

  const handleFetch = useCallback(async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/` + steamId);
    const data = await response.json();
    setData(data);
  }, [steamId]);

  const handleData = useMemo(() => {
    if (data === null) return null;

    console.log({ data });

    if ("job" in data) {
      console.log("job");
      return <Job id={data.job.id} />;
    }

    const inventoryIds = data.map((inventoryItem) => inventoryItem.Item.id);
    const formattedData = data.reduce((acc, inventoryItem) => {
      const item = inventoryItem.Item;
      const price = Number(item.Price.at(0)?.medianPrice);
      const formattedItem = {
        ...inventoryItem,
        total: inventoryItem.count * price,
      };
      return { ...acc, [inventoryItem.Item.id]: formattedItem };
    }, {});

    return <Inventory inventories={formattedData} ids={inventoryIds} />;
  }, [data]);

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
          onClick={handleFetch}
          className={"rounded-r p-2 dark:bg-slate-400"}
          type={"submit"}
        >
          fetch
        </button>
      </div>
      <div>
        <div></div>
      </div>
      {handleData}
    </div>
  );
}

export default InventoryPage;
