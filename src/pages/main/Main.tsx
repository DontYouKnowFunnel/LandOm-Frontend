import { useEffect, useState } from "react";
import PageHeader from "../../components/main/PageHeader";
import MetricCard from "../../components/main/MetricCard";
import SectionFunnelChart from "../../components/main/SectionFunnelChart";
import SessionTable from "../../components/main/SessionTable";
import SectionAnalysisCard from "../../components/main/SectionAnalysisCard";
import CompareAnalysisCard from "../../components/main/CompareAnalysisCard";
import AIInsightCard from "../../components/main/AIInsightCard";
import {
  UserIcon,
  MonitorIcon,
  RepeatIcon,
  ClockIcon,
} from "../../components/Icons";
import { getProjects } from "../../services/project";

const REACH_SECTIONS = [
  { ratio: 1.0 },
  { ratio: 0.74 },
  { ratio: 0.5 },
  { ratio: 0.88 },
];

const COMPARE_SECTIONS = [
  { ratio: 1.0 },
  { ratio: 0.74 },
  { ratio: 0.5 },
  { ratio: 0.88 },
];

const Main = () => {
  const [showInsight, setShowInsight] = useState(true);

  useEffect(() => {
    const setProjectKey = async () => {
      try {
        const projectsResponse = await getProjects();
        const firstProjectApiKey = projectsResponse.projects[0].apiKey;
        if (firstProjectApiKey)
          sessionStorage.setItem("projectKey", firstProjectApiKey);
      } catch (e) {
        return;
      }
    };

    void setProjectKey();
  }, []);

  return (
    <div className="flex flex-1 flex-col p-6 gap-4 bg-slate-50 overflow-y-auto">
      <PageHeader
        projectName="Bitda Landing Page"
        url="https://example-saas.com"
      />

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={UserIcon}
          iconRotate={7.36}
          iconClassName="text-slate-200"
          label="방문자 수"
          value="12,480"
        />
        <MetricCard
          icon={MonitorIcon}
          iconRotate={5.31}
          iconClassName="text-slate-200"
          label="세션 수"
          value="9,320"
        />
        <MetricCard
          icon={RepeatIcon}
          iconRotate={9.78}
          iconClassName="text-slate-200"
          label="전환율"
          value="30.0%"
        />
        <MetricCard
          icon={ClockIcon}
          iconRotate={5.31}
          iconClassName="text-slate-200"
          label="평균 체류 시간"
          value="2분 34초"
        />
      </div>

      <SectionFunnelChart />

      <div className="flex gap-4 items-stretch">
        <div className="flex-1 min-w-0">
          <SessionTable />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 h-full ${
            showInsight ? "max-w-96 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <div style={{ width: "384px" }} className="h-full">
            <AIInsightCard
              section="기능 소개"
              conversionRate="7.2%"
              onClose={() => setShowInsight(false)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionAnalysisCard
          title="랜딩페이지 점수"
          value="33/100"
          sections={REACH_SECTIONS}
        />
        <CompareAnalysisCard
          title="과거 대비 전환율 비교"
          change={14}
          sections={COMPARE_SECTIONS}
        />
      </div>
    </div>
  );
};

export default Main;
