import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProjectList } from "../../api/generated";
import {
  SidebarToggleIcon,
  DashboardIcon,
  FunnelIcon,
  SessionIcon,
  AiIcon,
} from "../Icons";
import brandLogo from "../../assets/image/brandLogo.svg";
import brandRow from "../../assets/image/brandRow.svg";
import {
  getStoredProjectId,
  SELECTED_PROJECT_CHANGED_EVENT,
  setStoredProjectId,
} from "../../constants/project";
import SidebarItem from "../ui/SidebarItem";
import ProjectSelector from "./ProjectSelector";
import type { ProjectItem } from "./ProjectSelector";
import NewProjectModal from "./NewProjectModal";
import ProjectSettingModal from "./ProjectSettingModal";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [settingProject, setSettingProject] = useState<ProjectItem | null>(
    null
  );
  const [selectedProjectIdState, setSelectedProjectId] = useState<
    number | null
  >(() => getStoredProjectId());
  const { data: projectListData, isLoading: isProjectListLoading } =
    useGetProjectList({
      query: {
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 0,
      },
    });

  const projects = useMemo(
    () =>
      (projectListData?.projects ?? [])
        .filter(
          (
            project
          ): project is {
            id: number;
            name?: string;
            url?: string;
            description?: string;
            apiKey?: string;
          } => project.id != null
        )
        .map((project) => ({
          id: project.id,
          name: project.name ?? "이름 없는 프로젝트",
          url: project.url ?? "https://example-saas.com",
          description: project.description ?? "",
          apiKey: project.apiKey ?? "",
        })),
    [projectListData?.projects]
  );

  const resolvedSelectedProjectId = useMemo(() => {
    if (!projects.length) return null;
    return (
      projects.find((project) => project.id === selectedProjectIdState)?.id ??
      projects[0].id
    );
  }, [projects, selectedProjectIdState]);

  useEffect(() => {
    const syncSelectedProject = () => {
      setSelectedProjectId(getStoredProjectId());
    };

    window.addEventListener(
      SELECTED_PROJECT_CHANGED_EVENT,
      syncSelectedProject
    );
    window.addEventListener("storage", syncSelectedProject);

    return () => {
      window.removeEventListener(
        SELECTED_PROJECT_CHANGED_EVENT,
        syncSelectedProject
      );
      window.removeEventListener("storage", syncSelectedProject);
    };
  }, []);

  return (
    <aside
      {...props}
      className={
        `relative z-30 flex flex-col min-h-screen bg-white border-r border-slate-200 shrink-0 overflow-visible transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[72px]" : "w-67.5"
        } ` + (props.className ?? "")
      }
    >
      <div
        className={`flex border-b border-slate-200 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "h-24 flex-col items-center justify-center gap-4 px-[14px] py-4"
            : "h-14 items-center justify-between px-4"
        }`}
      >
        <div className="flex h-8 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out">
          <img
            src={isCollapsed ? brandLogo : brandRow}
            alt="LandOm"
            className={`shrink-0 transition-all duration-300 ease-in-out ${
              isCollapsed ? "h-6 w-6" : "h-8"
            }`}
          />
        </div>
        <button
          type="button"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-500 transition-colors hover:text-slate-700"
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          aria-pressed={isCollapsed}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <SidebarToggleIcon className="h-6 w-6" />
        </button>
      </div>

      <ProjectSelector
        isCollapsed={isCollapsed}
        projects={projects}
        isLoading={isProjectListLoading}
        selectedProjectId={resolvedSelectedProjectId}
        onSelect={(projectId) => {
          setStoredProjectId(projectId);
          window.location.reload();
        }}
        onOpenSettings={(project) => setSettingProject(project)}
        onCreateProject={() => setIsNewProjectModalOpen(true)}
      />

      <nav
        className={`flex flex-col gap-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? "items-center p-3" : "px-3 pt-3"
        }`}
      >
        {NAV_ITEMS.map(({ icon, label, path }) => (
          <SidebarItem
            key={path}
            icon={icon}
            label={label}
            isActive={pathname === path}
            isCollapsed={isCollapsed}
            onClick={() => navigate(path)}
          />
        ))}
      </nav>

      <div
        className={`mt-auto flex h-14 items-center border-t border-slate-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? "justify-center px-5 py-3" : "justify-between px-4"
        }`}
      >
        <span
          className={`whitespace-nowrap text-sm text-slate-400 transition-all duration-300 ease-in-out ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-20 opacity-100"
          }`}
        >
          LandOm
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <span className="text-xs font-bold text-blue-500">JD</span>
        </div>
      </div>

      <NewProjectModal
        open={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      {settingProject && (
        <ProjectSettingModal
          project={settingProject}
          projects={projects}
          onClose={() => setSettingProject(null)}
        />
      )}
    </aside>
  );
};

export default Sidebar;
