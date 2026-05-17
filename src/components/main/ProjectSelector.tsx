import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { CircleCheckIcon, PlusIcon, SettingsIcon, SortIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";

export type ProjectItem = {
  id: number;
  name: string;
  url: string;
  description?: string;
  apiKey?: string;
};

type ProjectSelectorProps = {
  projects: ProjectItem[];
  selectedProjectId?: number | null;
  isLoading?: boolean;
  isCollapsed?: boolean;
  onSelect?: (projectId: number) => void;
  onOpenSettings?: (project: ProjectItem) => void;
  onCreateProject?: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onSelect">;

const getProjectInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const ProjectSelector = ({
  projects,
  selectedProjectId,
  isLoading = false,
  isCollapsed = false,
  onSelect,
  onOpenSettings,
  onCreateProject,
  className,
  ...props
}: ProjectSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);

  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0],
    [projects, selectedProjectId]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (selectorRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!selectedProject && !isLoading) {
    return (
      <div
        ref={selectorRef}
        className={`relative ${className ?? ""}`}
        {...props}
      >
        <button
          type="button"
          className={`flex h-[68px] w-full items-center border-b border-slate-200 text-left transition-all duration-300 ease-in-out ${
            isCollapsed ? "justify-center px-0" : "gap-4 px-4"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="프로젝트 선택"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50" />
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out">
                <p className="truncate text-sm font-semibold leading-5 text-slate-400">
                  페이지가 없습니다
                </p>
              </div>
              <SortIcon className="h-[18px] w-[18px] shrink-0 text-slate-500 transition-all duration-300 ease-in-out" />
            </>
          )}
        </button>

        {isOpen && (
          <div
            className={`absolute z-20 w-[258px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0px_4px_16px_4px_rgba(0,0,0,0.1)] ${
              isCollapsed ? "left-[58px] top-2" : "left-[34px] top-[59px]"
            }`}
          >
            <div className="flex h-14 items-center justify-between border border-slate-100 px-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50" />
                <p className="text-sm font-semibold leading-5 text-slate-400">
                  페이지가 없습니다
                </p>
              </div>
              <button
                type="button"
                className="rounded p-1 text-slate-500"
                aria-label="프로젝트 설정"
              ></button>
            </div>

            <div className="flex h-16 items-center justify-center border-b border-slate-100 px-3">
              <p className="text-sm font-medium leading-6 text-slate-500">
                프로젝트가 없습니다
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onCreateProject?.();
              }}
              className="flex h-10 w-full items-center justify-center gap-1 bg-slate-100 text-sm font-semibold leading-5 text-slate-600 hover:bg-slate-200"
            >
              <PlusIcon className="h-4 w-4" />새 프로젝트
            </button>
          </div>
        )}
      </div>
    );
  }

  const displayProject = selectedProject ?? {
    id: -1,
    name: "",
    url: "",
  };

  return (
    <div ref={selectorRef} className={`relative ${className ?? ""}`} {...props}>
      <button
        type="button"
        disabled={isLoading}
        className={`flex h-[68px] w-full items-center border-b border-slate-200 text-left transition-all duration-300 ease-in-out ${
          isCollapsed ? "justify-center px-0" : "gap-4 px-4"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="프로젝트 선택"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          {!isLoading && (
            <span className="text-sm font-semibold text-blue-500">
              {getProjectInitial(displayProject.name)}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out">
              {isLoading ? (
                <div className="flex flex-col gap-1">
                  <Skeleton height={20} />
                  <Skeleton height={16} />
                </div>
              ) : (
                <>
                  <p className="truncate text-sm font-semibold leading-5 text-gray-800">
                    {displayProject.name}
                  </p>
                  <p className="truncate text-xs font-light leading-4 text-gray-500">
                    {displayProject.url}
                  </p>
                </>
              )}
            </div>
            <SortIcon className="h-[18px] w-[18px] shrink-0 text-slate-500 transition-all duration-300 ease-in-out" />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 w-[258px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0px_4px_16px_4px_rgba(0,0,0,0.1)] ${
            isCollapsed ? "left-[58px] top-2" : "left-[34px] top-[59px]"
          }`}
        >
          <div className="flex w-full items-center justify-between border border-slate-100 p-3">
            <div className="flex w-[186px] items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                {!isLoading && (
                  <span className="text-sm font-semibold text-blue-500">
                    {getProjectInitial(displayProject.name)}
                  </span>
                )}
              </div>
              <div className="w-[138px]">
                {isLoading ? (
                  <div className="flex flex-col gap-1">
                    <Skeleton height={20} />
                    <Skeleton height={16} />
                  </div>
                ) : (
                  <>
                    <p className="truncate text-sm font-semibold leading-5 text-slate-800">
                      {displayProject.name}
                    </p>
                    <p className="truncate text-xs font-light leading-4 text-slate-500">
                      {displayProject.url}
                    </p>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              className="rounded p-1 text-slate-500"
              aria-label="프로젝트 설정"
              disabled={isLoading}
              onClick={(event) => {
                event.stopPropagation();
                onOpenSettings?.(displayProject);
                setIsOpen(false);
              }}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 px-3.5 py-2">
            {(isLoading
              ? [
                  { id: -1, name: "", url: "" },
                  { id: -2, name: "", url: "" },
                  { id: -3, name: "", url: "" },
                ]
              : projects
            ).map((project) => {
              const isSelected = project.id === displayProject.id;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onSelect?.(project.id);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 text-left"
                >
                  <div
                    className={isSelected ? "w-[138px] shrink-0" : "min-w-0"}
                  >
                    {isLoading ? (
                      <div className="flex flex-col gap-1">
                        <Skeleton height={20} />
                        <Skeleton height={16} />
                      </div>
                    ) : (
                      <>
                        <p className="truncate text-sm font-semibold leading-5 text-slate-800">
                          {project.name}
                        </p>
                        <p className="truncate text-xs font-light leading-4 text-slate-500">
                          {project.url}
                        </p>
                      </>
                    )}
                  </div>
                  {!isLoading && isSelected && (
                    <CircleCheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onCreateProject?.();
            }}
            className="flex w-full items-center justify-center gap-1 border-t border-slate-100 bg-slate-50 py-2.5 text-sm font-medium leading-5 text-slate-600"
          >
            <PlusIcon className="h-4 w-4" />새 프로젝트
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
