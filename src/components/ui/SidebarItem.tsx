import type { HTMLAttributes, ReactNode } from "react";

interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  icon: ReactNode;
  label: string;
}

const SidebarItem = ({ isActive, icon, label, ...props }: SidebarItemProps) => {
  if (isActive) {
    return (
      <div
        {...props}
        className={
          "flex items-center gap-3 px-3 h-11 rounded-xl bg-blue-50 cursor-pointer " +
          (props.className ?? "")
        }
      >
        <span className="text-blue-500 flex items-center">{icon}</span>
        <span className="text-sm font-semibold text-blue-500">{label}</span>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={
        "flex items-center gap-3 px-3 h-11 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors " +
        (props.className ?? "")
      }
    >
      <span className="text-slate-500 flex items-center">{icon}</span>
      <span className="text-sm font-semibold text-slate-500">{label}</span>
    </div>
  );
};

export default SidebarItem;
