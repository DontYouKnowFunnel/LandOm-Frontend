import { ChevronRightIcon, ChevronDownIcon } from "../Icons";

interface PageHeaderProps {
  projectName: string;
  url: string;
}

const PageHeader = ({ projectName, url }: PageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-semibold text-slate-900">
        {projectName}
      </span>
      <ChevronRightIcon className="text-slate-900 text-base" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 hover:underline"
      >
        {url}
      </a>
    </div>

    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg font-medium bg-white text-sm text-slate-500 hover:bg-slate-50">
      <span>최근 30일</span>
      <ChevronDownIcon className="text-slate-600 text-xl" />
    </button>
  </div>
);

export default PageHeader;
