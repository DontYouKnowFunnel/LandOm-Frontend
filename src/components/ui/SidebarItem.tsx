import type { HTMLAttributes, ReactNode } from "react";

interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  isCollapsed?: boolean;
  icon: ReactNode;
  label: string;
}

const SidebarItem = ({
  isActive,
  isCollapsed = false,
  icon,
  label,
  ...props
}: SidebarItemProps) => {
  const itemClassName = isCollapsed
    ? "h-11 w-11 justify-center rounded-lg p-3.5"
    : "h-11 w-full gap-3 rounded-xl px-3.5";

  if (isActive) {
    return (
      <div
        {...props}
        title={isCollapsed ? label : undefined}
        className={
          `flex items-center overflow-hidden bg-blue-50 cursor-pointer transition-all duration-300 ease-in-out ${itemClassName} ` +
          (props.className ?? "")
        }
      >
        <span className="text-blue-500 flex items-center">{icon}</span>
        <span
          className={`whitespace-nowrap text-sm font-bold text-blue-500 transition-all duration-300 ease-in-out ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-32 opacity-100"
          }`}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      {...props}
      title={isCollapsed ? label : undefined}
      className={
        `flex items-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-all duration-300 ease-in-out ${itemClassName} ` +
        (props.className ?? "")
      }
    >
      <span className="text-slate-500 flex items-center">{icon}</span>
      <span
        className={`whitespace-nowrap text-sm font-semibold text-slate-500 transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-32 opacity-100"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
