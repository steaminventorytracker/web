import React from "react";

function ActionButton({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={
        "rounded-md p-2 dark:text-white dark:hover:bg-slate-900 " + className
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default ActionButton;
