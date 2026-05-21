import { ChevronRightIcon, ChevronDownIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";

interface PageHeaderProps {
  projectName: string;
  url: string;
  isLoading?: boolean;
}

const PageHeader = ({ projectName, url, isLoading = false }: PageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1.5">
      {isLoading ? (
        <div className="w-44">
          <Skeleton height={28} />
        </div>
      ) : (
        <span className="text-xl font-semibold text-slate-900">
          {projectName}
        </span>
      )}
      <ChevronRightIcon className="text-slate-900 text-base" />
      {isLoading ? (
        <div className="w-56">
          <Skeleton height={24} />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          {url}
        </a>
      )}
    </div>

    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg font-medium bg-white text-sm text-slate-500 hover:bg-slate-50">
      <span>최근 30일</span>
      <ChevronDownIcon className="text-slate-600 text-xl" />
    </button>
  </div>
);

export default PageHeader;
