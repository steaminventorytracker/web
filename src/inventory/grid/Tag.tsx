import React from "react";

type TagStype = "orange" | "yellow" | "blue" | "green";

export type TagProps = {
  style: TagStype;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style">;

function Tag({
  children,
  style,
  className,
  ...props
}: React.PropsWithChildren<TagProps>) {
  if (!children) return null;

  const styles = {
    orange:
      "bg-orange-400 dark:bg-orange-500 dark:text-orange-950 hover:dark:bg-orange-400",
    yellow:
      "bg-yellow-400 dark:bg-yellow-500 dark:text-yellow-950 hover:dark:bg-yellow-400",
    blue: "bg-blue-400 dark:bg-blue-500 dark:text-blue-950 hover:dark:bg-blue-400",
    green:
      "bg-green-400 dark:bg-green-500 dark:text-green-950 hover:dark:bg-green-400",
  };

  const classes = [className ?? "", styles[style]];

  return (
    <button
      {...props}
      className={
        "h-5 w-fit rounded-lg px-1.5 text-xs font-bold " + classes.join(" ")
      }
    >
      {children}
    </button>
  );
}

export default Tag;
