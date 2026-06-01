import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import brandRow from "../../assets/image/brandRow.svg";
import { useSignup } from "../../api/generated";

type Step = 1 | 2 | 3;

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const signupMutation = useSignup({
    mutation: {
      onError: (error) => {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          setErrorMessage(
            error.response?.data?.message ?? "회원가입에 실패했습니다."
          );
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
        setStep(1);
      },
      onSuccess: () => {
        setStep(3);
      },
    },
  });

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    await signupMutation.mutateAsync({
      data: {
        username: username.trim(),
        nickname: nickname.trim(),
        password,
      },
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-start bg-white p-8 border border-slate-300 gap-6 w-96 min-h-127.5">
        <div className="w-full flex flex-col items-start gap-3">
          <img src={brandRow} alt="LandOm" className="h-8" />
          <span className="text-2xl font-bold text-slate-900">회원가입</span>
          {/* Progress bars */}
          <div className="flex gap-2 w-full">
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                step >= 2 ? "bg-green-500" : "bg-slate-100"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                step >= 3 ? "bg-green-500" : "bg-slate-100"
              }`}
            />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form
            className="flex flex-col flex-1 gap-4 w-full"
            onSubmit={handleStep1}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-800">
                아이디 *
              </span>
              <input
                type="text"
                className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium w-full"
                placeholder="아이디 입력"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-800">
                비밀번호 *
              </span>
              <input
                type="password"
                className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium placeholder:text-sm w-full"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-800">
                비밀번호 확인 *
              </span>
              <input
                type="password"
                className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium placeholder:text-sm w-full"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex-1 flex flex-col justify-end items-center w-full">
              {errorMessage && (
                <span className="text-xs font-medium text-red-500">
                  {errorMessage}
                </span>
              )}
              <button
                type="submit"
                className="flex justify-center p-2 bg-blue-500 rounded-lg mt-2 w-full"
              >
                <span className="text-sm font-semibold text-white">
                  다음 단계
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form
            className="flex flex-col flex-1 gap-4 w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-800">
                닉네임 *
              </span>
              <input
                type="text"
                className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium placeholder:text-sm w-full"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoComplete="nickname"
                autoFocus
              />
            </div>
            {errorMessage && (
              <span className="text-xs font-medium text-red-500">
                {errorMessage}
              </span>
            )}
            <div className="flex flex-col gap-2 mt-auto">
              <p className="text-xs font-semibold text-slate-500 text-center">
                회원가입시{" "}
                <span className="text-blue-500">개인정보 동의 약관</span>에
                동의함으로 간주합니다
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage("");
                  }}
                  className="flex-1 flex justify-center p-2 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-600">
                    이전
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="flex-1 flex justify-center p-2.5 bg-blue-500 rounded-lg disabled:opacity-60"
                >
                  <span className="text-sm font-semibold text-white">
                    {signupMutation.isPending ? "처리 중..." : "회원가입"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3 - Complete */}
        {step === 3 && (
          <div className="flex flex-col flex-1 gap-4 w-full">
            <div className="flex flex-col flex-1 items-center justify-center gap-1">
              <p className="text-base font-bold text-slate-900">
                회원가입이 완료되었습니다!
              </p>
              <p className="text-sm font-medium text-slate-500 text-center leading-relaxed">
                서비스 이용을 위해 로그인 후 이용 바랍니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="flex justify-center p-2.5 bg-blue-500 rounded-lg"
            >
              <span className="text-sm font-semibold text-white">
                로그인 하기
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
