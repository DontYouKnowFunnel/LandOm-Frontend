import { useCallback, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetProjectListQueryKey,
  useDeleteProject,
  useUpdateProject,
} from "../../api/generated";
import { setStoredProjectId } from "../../constants/project";
import type { ProjectItem } from "./ProjectSelector";

type ProjectSettingModalProps = {
  project: ProjectItem;
  projects: ProjectItem[];
  onClose: () => void;
};

const isValidUrl = (value: string) => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const ProjectSettingModal = ({
  project,
  projects,
  onClose,
}: ProjectSettingModalProps) => {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState(project.name);
  const [landingPageUrl, setLandingPageUrl] = useState(project.url);
  const [description, setDescription] = useState(project.description ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteAskOpen, setIsDeleteAskOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const closeModal = useCallback(() => {
    setIsDeleteAskOpen(false);
    onClose();
  }, [onClose]);

  const updateProjectMutation = useUpdateProject({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetProjectListQueryKey(),
        });
        closeModal();
      },
    },
  });

  const deleteProjectMutation = useDeleteProject({
    mutation: {
      onSuccess: async () => {
        const remainedProjects = projects.filter(
          (targetProject) => targetProject.id !== project.id
        );
        const nextProject = remainedProjects[0];
        setStoredProjectId(nextProject?.id ?? null);

        await queryClient.invalidateQueries({
          queryKey: getGetProjectListQueryKey(),
        });
        closeModal();
      },
    },
  });

  const handleCopyApiKey = async () => {
    if (!project.apiKey) return;
    await navigator.clipboard.writeText(project.apiKey);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1000);
  };

  const handleUpdate = async () => {
    const trimmedProjectName = projectName.trim();
    const trimmedLandingPageUrl = landingPageUrl.trim();
    const trimmedDescription = description.trim();

    if (!trimmedProjectName || !trimmedLandingPageUrl) {
      setErrorMessage("프로젝트 명과 랜딩페이지 URL을 입력해주세요.");
      return;
    }

    if (!isValidUrl(trimmedLandingPageUrl)) {
      setErrorMessage("랜딩페이지 URL 형식이 올바르지 않습니다.");
      return;
    }

    setErrorMessage("");

    await updateProjectMutation.mutateAsync({
      projectId: project.id,
      data: {
        name: trimmedProjectName,
        url: trimmedLandingPageUrl,
        description: trimmedDescription || undefined,
      },
    });
  };

  const handleDelete = async () => {
    await deleteProjectMutation.mutateAsync({ projectId: project.id });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
        onClick={closeModal}
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="프로젝트 설정"
          className="w-[556px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium leading-5 text-slate-600">
              프로젝트 설정
            </p>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal leading-5 text-slate-800">
                API Key
              </span>
              <div className="flex h-10 items-center justify-between rounded bg-slate-100 px-2.5">
                <span className="truncate text-sm font-medium leading-5 text-slate-900">
                  {project.apiKey ?? "-"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyApiKey}
                  className="rounded p-1 text-slate-500 hover:bg-slate-200"
                  aria-label="API Key 복사"
                >
                  <Icon icon="lucide:copy" className="h-4 w-4" />
                </button>
              </div>
              {isCopied && (
                <span className="text-xs font-medium text-blue-500">
                  API Key를 복사했습니다.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-project-name"
                className="text-sm font-normal leading-5 text-slate-800"
              >
                프로젝트 명 *
              </label>
              <input
                id="edit-project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="프로젝트 명 입력"
                className="h-10 rounded bg-slate-100 px-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-project-url"
                className="text-sm font-normal leading-5 text-slate-800"
              >
                랜딩페이지 URL *
              </label>
              <input
                id="edit-project-url"
                value={landingPageUrl}
                onChange={(event) => setLandingPageUrl(event.target.value)}
                placeholder="랜딩페이지 URL 입력"
                className="h-10 rounded bg-slate-100 px-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-project-description"
                className="text-sm font-normal leading-5 text-slate-800"
              >
                설명
              </label>
              <textarea
                id="edit-project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="설명 입력"
                className="h-33 w-full resize-none rounded bg-slate-100 p-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            {errorMessage !== "" && (
              <span className="text-xs font-medium text-red-500">
                {errorMessage}
              </span>
            )}
            {axios.isAxiosError(updateProjectMutation.error) && (
              <span className="text-xs font-medium text-red-500">
                {updateProjectMutation.error.response?.data?.message ??
                  "프로젝트 수정에 실패했습니다."}
              </span>
            )}

            <div className="flex w-full items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteAskOpen(true)}
                className="h-9 w-[107px] rounded-lg bg-red-500 text-sm font-semibold leading-5 text-white hover:bg-red-600"
              >
                삭제
              </button>
              <button
                type="button"
                disabled={updateProjectMutation.isPending}
                onClick={() => {
                  void handleUpdate();
                }}
                className="h-9 w-[107px] rounded-lg bg-blue-500 text-sm font-semibold leading-5 text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {updateProjectMutation.isPending ? "변경 중..." : "변경"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleteAskOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
          onClick={() => setIsDeleteAskOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="프로젝트 삭제 확인"
            className="w-[348px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium leading-5 text-slate-600">
                프로젝트 삭제
              </p>
              <div className="flex flex-col gap-2 text-sm leading-5 text-slate-900">
                <p>
                  <span className="font-semibold">{project.name}</span>{" "}
                  프로젝트가{" "}
                  <span className="font-semibold text-red-500">삭제</span>
                  됩니다.
                </p>
                <p>
                  프로젝트의 정보, 수집된 사용자 정보, 퍼널 분석 결과, 개선안
                  등이 영구히 삭제되며, 복원 할 수 없습니다.
                </p>
                <p>정말로 삭제하시겠습니까?</p>
              </div>

              {axios.isAxiosError(deleteProjectMutation.error) && (
                <span className="text-xs font-medium text-red-500">
                  {deleteProjectMutation.error.response?.data?.message ??
                    "프로젝트 삭제에 실패했습니다."}
                </span>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void handleDelete();
                  }}
                  disabled={deleteProjectMutation.isPending}
                  className="h-9 w-[107px] rounded-lg bg-red-500 text-sm font-semibold leading-5 text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {deleteProjectMutation.isPending ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectSettingModal;
