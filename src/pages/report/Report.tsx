import { useGetFunnelAnalytics } from "../../hooks/api/useAnalytics";
import FunnelChart from "../../components/ui/FunnelChart";

const Report = () => {
  const { data, isLoading } = useGetFunnelAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-slate-400 text-sm">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">퍼널 분석</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full">
        {data?.funnelData && <FunnelChart data={data.funnelData} />}
      </div>
    </div>
  );
};

export default Report;
