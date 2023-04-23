import React from "react";

type TagStype = "orange" | "yellow";

export type TagProps = {
  style: TagStype;
};

function Tag({ children, style }: React.PropsWithChildren<TagProps>) {
  if (!children) return null;

  const styles = {
    orange:
      "bg-orange-400 dark:bg-orange-500 dark:text-orange-950 hover:dark:bg-orange-400",
    yellow:
      "bg-yellow-400 dark:bg-yellow-500 dark:text-yellow-950 hover:dark:bg-yellow-400",
  };

  return (
    <button
      className={"rounded-lg px-1.5 py-0.5 text-xs font-bold " + styles[style]}
    >
      {children}
    </button>
  );
}

export default Tag;
