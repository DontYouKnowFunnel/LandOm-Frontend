import { ChevronRightIcon } from "../Icons";
import Skeleton from "../ui/Skeleton";

interface PageHeaderProps {
  projectName: string;
  url: string;
  isLoading?: boolean;
}

const PageHeader = ({ projectName, url, isLoading = false }: PageHeaderProps) => (
  <div className="flex items-center justify-start">
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
  </div>
);

export default PageHeader;
