import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import brandRow from "../../assets/image/brandRow.svg";
import { login } from "../../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const request = await login({ username: trimmedUsername, password });
      const response = await request();

      sessionStorage.setItem("accessToken", response.accessToken);
      sessionStorage.setItem("refreshToken", response.refreshToken);

      navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setErrorMessage(error.response?.data?.message ?? "로그인에 실패했습니다.");
      } else {
        setErrorMessage("로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-start bg-white p-8 border border-slate-300 gap-8">
        <img src={brandRow} alt="LandOm" className="h-8" />
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-normal text-slate-800">아이디</span>
            <input
              type="text"
              className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium w-80"
              placeholder="아이디 입력"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-normal text-slate-800">비밀번호</span>
            <input
              type="password"
              className="p-2.5 rounded-sm bg-slate-100 text-sm placeholder:font-medium w-80"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <span className="text-xs font-semibold text-slate-800 self-end">
              회원가입
            </span>
          </div>
          {errorMessage && (
            <span className="text-xs font-medium text-red-500">{errorMessage}</span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center p-2 bg-blue-500 rounded-lg disabled:opacity-60"
          >
            <span className="text-sm font-semibold text-white text-center">
              {isLoading ? "로그인 중..." : "로그인"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
