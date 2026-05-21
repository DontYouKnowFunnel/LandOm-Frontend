import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const REDIRECT_DELAY_MS = 1500;

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 p-5">
      <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white px-7 py-6 text-slate-700">
        <p className="text-lg font-semibold leading-7">문제가 발생했습니다</p>
        <p className="text-sm leading-5 text-slate-500">
          잠시 후 메인 화면으로 이동합니다.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
