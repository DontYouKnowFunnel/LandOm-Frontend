import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetProjectListQueryKey,
  useCreateProject,
} from "../../api/generated";
import { setStoredProjectId } from "../../constants/project";

type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

const NewProjectModal = ({ open, onClose }: NewProjectModalProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const resetForm = useCallback(() => {
    setProjectName("");
    setProjectUrl("");
    setDescription("");
    setErrorMessage("");
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const createProjectMutation = useCreateProject({
    mutation: {
      onSuccess: async (response) => {
        if (response.id != null) {
          setStoredProjectId(response.id);
        }

        await queryClient.invalidateQueries({
          queryKey: getGetProjectListQueryKey(),
        });

        handleClose();
        window.location.assign("/");
      },
    },
  });

  const isValidUrl = (value: string) => {
    try {
      const parsedUrl = new URL(value);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedProjectName = projectName.trim();
    const trimmedProjectUrl = projectUrl.trim();
    const trimmedDescription = description.trim();

    if (!trimmedProjectName || !trimmedProjectUrl) {
      setErrorMessage("프로젝트 명과 랜딩페이지 URL을 입력해주세요.");
      return;
    }

    if (!isValidUrl(trimmedProjectUrl)) {
      setErrorMessage("랜딩페이지 URL 형식이 올바르지 않습니다.");
      return;
    }

    setErrorMessage("");

    await createProjectMutation.mutateAsync({
      data: {
        name: trimmedProjectName,
        url: trimmedProjectUrl,
        description: trimmedDescription || trimmedProjectName,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
      onClick={handleClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="새 프로젝트 생성"
        className="w-[556px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
        onClick={stopPropagation}
      >
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <p className="text-sm font-medium leading-5 text-slate-600">
            새 프로젝트 생성
          </p>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="project-name"
              className="text-sm font-normal leading-5 text-slate-800"
            >
              프로젝트 명 *
            </label>
            <input
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="프로젝트 명 입력"
              className="w-full rounded bg-slate-100 p-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="project-url"
              className="text-sm font-normal leading-5 text-slate-800"
            >
              랜딩페이지 URL *
            </label>
            <input
              id="project-url"
              value={projectUrl}
              onChange={(event) => setProjectUrl(event.target.value)}
              placeholder="랜딩페이지 URL 입력"
              className="w-full rounded bg-slate-100 p-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="project-description"
              className="text-sm font-normal leading-5 text-slate-800"
            >
              설명
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="설명 입력"
              className="h-40 w-full resize-none rounded bg-slate-100 p-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {errorMessage !== "" && (
            <span className="text-xs font-medium text-red-500">
              {errorMessage}
            </span>
          )}
          {axios.isAxiosError(createProjectMutation.error) && (
            <span className="text-xs font-medium text-red-500">
              {createProjectMutation.error.response?.data?.message ??
                "프로젝트 생성에 실패했습니다."}
            </span>
          )}

          <div className="flex w-full flex-col items-end justify-center">
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="h-9 w-32 rounded-lg bg-blue-500 py-2 text-sm font-semibold leading-5 text-white disabled:opacity-60"
            >
              {createProjectMutation.isPending ? "생성 중..." : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
