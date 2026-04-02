import type { HTMLAttributes } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarToggleIcon,
  DashboardIcon,
  FunnelIcon,
  SessionIcon,
  AiIcon,
  SortIcon,
} from "../Icons";
import brandRow from "../../assets/image/brandRow.svg";
import SidebarItem from "../ui/SidebarItem";

type SidebarProps = HTMLAttributes<HTMLDivElement>;

const NAV_ITEMS = [
  { icon: <DashboardIcon className="w-4 h-4" />, label: "대시보드", path: "/" },
  {
    icon: <FunnelIcon className="w-4 h-4" />,
    label: "퍼널 분석",
    path: "/report",
  },
  {
    icon: <SessionIcon className="w-4 h-4" />,
    label: "사용자 세션",
    path: "/session",
  },
  { icon: <AiIcon className="w-4 h-4" />, label: "AI 개선안", path: "/ai" },
];

const Sidebar = ({ ...props }: SidebarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      {...props}
      className={
        "flex flex-col w-67.5 min-h-screen bg-white border-r border-slate-200 shrink-0 " +
        (props.className ?? "")
      }
    >
      <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <img src={brandRow} alt="LandOm" className="h-8" />
        </div>
        <SidebarToggleIcon className="w-6 h-6 text-slate-500 cursor-pointer" />
      </div>

      <div className="flex items-center gap-3 px-4 h-17 border-b border-slate-200">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 shrink-0">
          <span className="text-blue-500 font-bold text-base">B</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            예시 랜딩 페이지
          </p>
          <p className="text-xs text-slate-500 truncate">
            https://example-saas.com
          </p>
        </div>
        <SortIcon className="w-5 h-5 text-slate-500 shrink-0" />
      </div>

      <nav className="flex flex-col px-3 pt-3">
        {NAV_ITEMS.map(({ icon, label, path }) => (
          <SidebarItem
            key={path}
            icon={icon}
            label={label}
            isActive={pathname === path}
            onClick={() => navigate(path)}
          />
        ))}
      </nav>

      <div className="mt-auto flex items-center justify-between px-4 h-14 border-t border-slate-200">
        <span className="text-sm text-slate-400">LandOm</span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <span className="text-xs font-bold text-blue-500">JD</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
