import React, { useEffect, useState } from "react";
import { socket } from "../../App";
import { Item as ItemType, JobResponse, Price } from "../../types/api";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";

type SocketResponse = { price: Price; item: ItemType };

const formatter = new Intl.RelativeTimeFormat("fr", {
  style: "short",
  numeric: "auto",
});

function Job() {
  const [prices, setPrices] = useState<{ id: string; name: string }[]>([]);
  const { job, steamId } = useLocation().state as JobResponse & {
    steamId: string;
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!job) {
      navigate("/");

      return;
    }

    socket.on(`/job/${job.id}/prices`, (data: SocketResponse) => {
      setPrices((prices) => [
        {
          id: data.item.id,
          name: data.item.marketHashName,
        },
        ...prices,
      ]);
    });

    socket.on(`/job/${job.id}`, () => {
      console.log("job done");

      navigate(`/inventory/${steamId}`);

      socket.off(`/job/${job.id}/prices`);
    });

    return () => {
      socket.off(`job/${job.id}/prices`);
      socket.off(`job/${job.id}`);
    };
  }, [job, navigate, steamId]);

  return (
    <div
      className={
        "container relative flex flex-col items-center justify-center dark:text-white"
      }
    >
      <div
        className={
          "flex flex-col items-center rounded border p-3 dark:bg-slate-800"
        }
      >
        <div>{`Queue position: ${job.queue_length}`}</div>
        <div>{`Estimated time: ${formatter.format(
          job.estimated_time / 60,
          "minute"
        )}`}</div>
      </div>
      <div
        className={
          "test container relative flex max-h-60 w-96 flex-col items-center overflow-y-hidden dark:bg-slate-950"
        }
      >
        {prices.map((price, index) => {
          return (
            <div key={price.id}>{`#${prices.length - index} ${
              price.name
            }`}</div>
          );
        })}
      </div>
    </div>
  );
}

export default Job;
