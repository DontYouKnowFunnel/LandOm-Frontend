import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetMyInfoQueryKey,
  useGetMyInfo,
  useUpdateMyInfo,
  useUpdatePassword,
  useWithdraw,
} from "../../api/generated";
import { EditIcon, LockIcon, LogOutIcon } from "../Icons";

type UserAccountMenuProps = {
  isCollapsed: boolean;
};

type AccountModalMode = "profile" | "password" | "withdraw";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

const getProfileInitial = (nickname?: string, username?: string) => {
  const source = nickname?.trim() || username?.trim() || "U";
  return source.charAt(0).toUpperCase();
};

const inputClassName =
  "h-10 w-full rounded bg-slate-100 px-2.5 text-sm font-medium leading-5 text-slate-800 placeholder:text-slate-500 focus:outline-none";

const UserAccountMenu = ({ isCollapsed }: UserAccountMenuProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AccountModalMode | null>(null);
  const [nickname, setNickname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: userInfo, isLoading: isUserLoading } = useGetMyInfo({
    query: {
      staleTime: 60_000,
      retry: 1,
    },
  });

  const updateMyInfoMutation = useUpdateMyInfo({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetMyInfoQueryKey(),
        });
        setModalMode(null);
      },
    },
  });

  const updatePasswordMutation = useUpdatePassword({
    mutation: {
      onSuccess: () => {
        setModalMode(null);
      },
    },
  });

  const withdrawMutation = useWithdraw({
    mutation: {
      onSuccess: () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        queryClient.clear();
        navigate("/login", { replace: true });
      },
    },
  });

  const resetMutations = () => {
    updateMyInfoMutation.reset();
    updatePasswordMutation.reset();
    withdrawMutation.reset();
  };

  const resetFormState = () => {
    setErrorMessage("");
    setOldPassword("");
    setNewPassword("");
    setWithdrawPassword("");
    resetMutations();
  };

  const closeModal = () => {
    setModalMode(null);
    resetFormState();
  };

  const openProfileModal = () => {
    resetFormState();
    setNickname(userInfo?.nickname ?? "");
    setModalMode("profile");
    setIsMenuOpen(false);
  };

  const openPasswordModal = () => {
    resetFormState();
    setModalMode("password");
    setIsMenuOpen(false);
  };

  const openWithdrawModal = () => {
    resetFormState();
    setModalMode("withdraw");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (menuRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!modalMode) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  });

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    setErrorMessage("");
    updateMyInfoMutation.reset();
    await updateMyInfoMutation.mutateAsync({
      data: {
        nickname: trimmedNickname,
      },
    });
  };

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oldPassword || !newPassword) {
      setErrorMessage("이전 비밀번호와 새로운 비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    updatePasswordMutation.reset();
    await updatePasswordMutation.mutateAsync({
      data: {
        oldPassword,
        newPassword,
      },
    });
  };

  const handleWithdraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!withdrawPassword) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    withdrawMutation.reset();
    await withdrawMutation.mutateAsync({
      data: {
        password: withdrawPassword,
      },
    });
  };

  const profileInitial = getProfileInitial(
    userInfo?.nickname,
    userInfo?.username
  );
  const username = userInfo?.username ?? "username";
  const profileErrorMessage =
    errorMessage ||
    (updateMyInfoMutation.error
      ? getApiErrorMessage(
          updateMyInfoMutation.error,
          "유저 정보 수정에 실패했습니다."
        )
      : "");
  const passwordErrorMessage =
    errorMessage ||
    (updatePasswordMutation.error
      ? getApiErrorMessage(
          updatePasswordMutation.error,
          "비밀번호 수정에 실패했습니다."
        )
      : "");
  const withdrawErrorMessage =
    errorMessage ||
    (withdrawMutation.error
      ? getApiErrorMessage(withdrawMutation.error, "회원 탈퇴에 실패했습니다.")
      : "");

  return (
    <>
      <div ref={menuRef} className="relative h-8 w-8 shrink-0">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-100 transition hover:bg-blue-200"
          aria-label="유저 메뉴 열기"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
        >
          <span className="text-xs font-bold text-blue-500">
            {isUserLoading ? "" : profileInitial}
          </span>
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className={`absolute bottom-10 z-40 w-[184px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0px_4px_16px_4px_rgba(0,0,0,0.1)] ${
              isCollapsed ? "left-[46px]" : "right-0"
            }`}
          >
            <div className="flex flex-col items-start p-2">
              <button
                type="button"
                role="menuitem"
                onClick={openProfileModal}
                className="flex w-full items-center gap-2.5 rounded p-1 text-left text-sm font-medium leading-5 text-slate-800 hover:bg-slate-50"
              >
                <EditIcon className="h-4 w-4 shrink-0" />
                유저 정보 수정하기
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={openPasswordModal}
                className="flex w-full items-center gap-2.5 rounded p-1 text-left text-sm font-medium leading-5 text-slate-800 hover:bg-slate-50"
              >
                <LockIcon className="h-4 w-4 shrink-0" />
                비밀번호 수정하기
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded p-1 text-left text-sm font-medium leading-5 text-slate-800 hover:bg-slate-50"
              >
                <LogOutIcon className="h-4 w-4 shrink-0" />
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>

      {modalMode === "profile" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
          onClick={closeModal}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="유저 정보 수정"
            className="w-[556px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <form className="flex flex-col gap-3" onSubmit={handleUpdateProfile}>
              <p className="text-sm font-medium leading-5 text-slate-600">
                유저 정보 수정
              </p>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="user-nickname"
                  className="text-sm font-normal leading-5 text-slate-800"
                >
                  닉네임 *
                </label>
                <input
                  id="user-nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="닉네임 입력"
                  className={inputClassName}
                  autoComplete="nickname"
                  autoFocus
                />
              </div>

              {profileErrorMessage !== "" && (
                <span className="text-xs font-medium text-red-500">
                  {profileErrorMessage}
                </span>
              )}

              <div className="flex w-full items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={openWithdrawModal}
                  className="h-9 w-32 rounded-lg bg-red-500 text-sm font-semibold leading-5 text-white hover:bg-red-600"
                >
                  회원 탈퇴
                </button>
                <button
                  type="submit"
                  disabled={updateMyInfoMutation.isPending}
                  className="h-9 w-32 rounded-lg bg-blue-500 text-sm font-semibold leading-5 text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  {updateMyInfoMutation.isPending ? "변경 중..." : "변경"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === "withdraw" && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
          onClick={closeModal}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="회원 탈퇴"
            className="w-[348px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <form className="flex flex-col gap-3" onSubmit={handleWithdraw}>
              <p className="text-sm font-medium leading-5 text-slate-600">
                회원 탈퇴
              </p>
              <div className="flex flex-col gap-2 text-sm font-normal leading-5 text-slate-900">
                <p>
                  <span className="font-semibold">{username}</span> 유저가{" "}
                  <span className="font-semibold text-red-500">삭제</span>
                  됩니다.
                </p>
                <p>
                  소유한 프로젝트, 프로젝트의 정보, 수집된 사용자 정보, 퍼널
                  분석 결과, 개선안 등이 영구히 삭제되며, 복원 할 수 없습니다.
                </p>
                <p>정말로 탈퇴하시겠습니까?</p>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="withdraw-password"
                  className="text-sm font-normal leading-5 text-slate-800"
                >
                  비밀번호 *
                </label>
                <input
                  id="withdraw-password"
                  type="password"
                  value={withdrawPassword}
                  onChange={(event) => setWithdrawPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                  className={inputClassName}
                  autoComplete="current-password"
                  autoFocus
                />
              </div>

              {withdrawErrorMessage !== "" && (
                <span className="text-xs font-medium text-red-500">
                  {withdrawErrorMessage}
                </span>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={withdrawMutation.isPending}
                  className="h-9 w-32 rounded-lg bg-red-500 text-sm font-semibold leading-5 text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {withdrawMutation.isPending ? "탈퇴 중..." : "탈퇴"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === "password" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.33)] p-2.5"
          onClick={closeModal}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="비밀번호 수정"
            className="w-[556px] overflow-hidden rounded-xl border border-slate-300 bg-white p-[14px] shadow-[0px_0px_16px_4px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <form
              className="flex flex-col gap-3"
              onSubmit={handleUpdatePassword}
            >
              <p className="text-sm font-medium leading-5 text-slate-600">
                비밀번호 수정
              </p>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="old-password"
                  className="text-sm font-normal leading-5 text-slate-800"
                >
                  이전 비밀번호 *
                </label>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  placeholder="이전 비밀번호 입력"
                  className={inputClassName}
                  autoComplete="current-password"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="new-password"
                  className="text-sm font-normal leading-5 text-slate-800"
                >
                  새로운 비밀번호 *
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="새로운 비밀번호 입력"
                  className={inputClassName}
                  autoComplete="new-password"
                />
              </div>

              {passwordErrorMessage !== "" && (
                <span className="text-xs font-medium text-red-500">
                  {passwordErrorMessage}
                </span>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="h-9 w-32 rounded-lg bg-blue-500 text-sm font-semibold leading-5 text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  {updatePasswordMutation.isPending ? "변경 중..." : "변경"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAccountMenu;
