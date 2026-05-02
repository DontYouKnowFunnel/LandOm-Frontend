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
      } catch {
        return;
      }
    };

    void setProjectKey();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 p-5">
      <PageHeader
        projectName="SaaS Landing Page"
        url="https://example-saas.com"
      />

      <div className="flex flex-1 flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            icon={UserIcon}
            iconRotate={7.36}
            iconClassName="text-slate-200"
            label="방문자 수"
            value="42,380"
          />
          <MetricCard
            icon={MonitorIcon}
            iconRotate={5.31}
            iconClassName="text-slate-200"
            label="세션 수"
            value="58,912"
          />
          <MetricCard
            icon={RepeatIcon}
            iconRotate={9.78}
            iconClassName="text-slate-200"
            label="전환률"
            value="4.82%"
          />
          <MetricCard
            icon={ClockIcon}
            iconRotate={5.31}
            iconClassName="text-slate-200"
            label="평균 체류시간"
            value="03:24"
          />
        </div>

        <SectionFunnelChart />

        <div className="flex items-stretch gap-4">
          <div className="min-w-0 flex-1">
            <SessionTable />
          </div>
          <div
            className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
              showInsight ? "max-w-96 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <div className="h-full w-96">
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
            period="2026-04-12 - 2026-04-19"
            sections={REACH_SECTIONS}
          />
          <CompareAnalysisCard
            title="과거 대비 전환률 비교"
            change={4.24}
            period="2026-04-12 - 2026-04-19"
            sections={COMPARE_SECTIONS}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
