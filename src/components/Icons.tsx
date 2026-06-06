import type { HTMLAttributes } from "react";
import { Icon } from "@iconify/react";

export const HomeIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:home-outline"
      className={className}
      {...(props as object)}
    />
  );
};

export const SidebarToggleIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="ph:sidebar-simple"
      className={className}
      {...(props as object)}
    />
  );
};

export const DashboardIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:layout-dashboard"
      className={className}
      {...(props as object)}
    />
  );
};

export const FunnelIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:funnel" className={className} {...(props as object)} />
  );
};
export const SessionIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:activity" className={className} {...(props as object)} />
  );
};

export const ImproveIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:sparkles" className={className} {...(props as object)} />
  );
};

export const ImproveBackgroundIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="glyphs:sparkles-bold"
      className={className}
      {...(props as object)}
    />
  );
};

export const AiIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:sparkles" className={className} {...(props as object)} />
  );
};

export const AXIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return <Icon icon="ix:ai" className={className} {...(props as object)} />;
};

export const ImproveActionIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return <Icon icon="ix:ai" className={className} {...(props as object)} />;
};

export const LoadingLoopIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="line-md:loading-loop"
      className={className}
      {...(props as object)}
    />
  );
};

export const SortIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return <Icon icon="uil:sort" className={className} {...(props as object)} />;
};

export const SettingsIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:settings" className={className} {...(props as object)} />
  );
};

export const CircleCheckIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:circle-check"
      className={className}
      {...(props as object)}
    />
  );
};

export const PlusIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:plus" className={className} {...(props as object)} />
  );
};

export const FolderXIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:folder-x" className={className} {...(props as object)} />
  );
};

export const HeroIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="tabler:layout" className={className} {...(props as object)} />
  );
};

export const ProblemIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:triangle-alert"
      className={className}
      {...(props as object)}
    />
  );
};

export const TargetIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:target" className={className} {...(props as object)} />
  );
};

export const UsecaseIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:workflow" className={className} {...(props as object)} />
  );
};

export const FeatureIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:sparkles" className={className} {...(props as object)} />
  );
};

export const ValuePropIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:gem" className={className} {...(props as object)} />
  );
};

export const TrustIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:users" className={className} {...(props as object)} />
  );
};

export const PricingIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:wallet" className={className} {...(props as object)} />
  );
};

export const FaqIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:circle-help"
      className={className}
      {...(props as object)}
    />
  );
};

export const CtaselectionIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:mouse-pointer-click"
      className={className}
      {...(props as object)}
    />
  );
};

export const GenericIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:shapes" className={className} {...(props as object)} />
  );
};

export const CartIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:shopping-cart"
      className={className}
      {...(props as object)}
    />
  );
};

export const UserIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:user" className={className} {...(props as object)} />
  );
};

export const MonitorIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:monitor-smartphone"
      className={className}
      {...(props as object)}
    />
  );
};

export const SignInIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="si:sign-in-fill" className={className} {...(props as object)} />
  );
};

export const ClockIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:clock" className={className} {...(props as object)} />
  );
};

export const RepeatIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:repeat-2" className={className} {...(props as object)} />
  );
};

export const GlobeIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:globe" className={className} {...(props as object)} />
  );
};

export const PlayButtonIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:play-circle-rounded"
      className={className}
      {...(props as object)}
    />
  );
};

export const ChevronRightIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:chevron-right"
      className={className}
      {...(props as object)}
    />
  );
};

export const ArrowLeftIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:arrow-left"
      className={className}
      {...(props as object)}
    />
  );
};

export const ArrowRightIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:arrow-right"
      className={className}
      {...(props as object)}
    />
  );
};

export const ChevronDownIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:chevron-down"
      className={className}
      {...(props as object)}
    />
  );
};

export const ArrowDropDownRoundedIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:arrow-drop-down-rounded"
      className={className}
      {...(props as object)}
    />
  );
};

export const ChevronUpIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="lucide:chevron-up"
      className={className}
      {...(props as object)}
    />
  );
};

export const RefreshIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:refresh-rounded"
      className={className}
      {...(props as object)}
    />
  );
};

export const FileOutlineIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="mdi:file-outline"
      className={className}
      {...(props as object)}
    />
  );
};

export const CopyIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:copy" className={className} {...(props as object)} />
  );
};

export const MegaphoneIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="mdi:megaphone" className={className} {...(props as object)} />
  );
};

export const SelectIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:select"
      className={className}
      {...(props as object)}
    />
  );
};

export const CheckIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="mingcute:check-fill"
      className={className}
      {...(props as object)}
    />
  );
};

export const CheckLineIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:check" className={className} {...(props as object)} />
  );
};

export const DragHorizontalIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="teenyicons:drag-horizontal-outline"
      className={className}
      {...(props as object)}
    />
  );
};

export const CloseIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:close-rounded"
      className={className}
      {...(props as object)}
    />
  );
};

export const StatusExploringIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:more-horiz"
      className={className}
      {...(props as object)}
    />
  );
};

export const StatusConvertedIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:check-rounded"
      className={className}
      {...(props as object)}
    />
  );
};

export const StatusExitedIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon
      icon="material-symbols:close-rounded"
      className={className}
      {...(props as object)}
    />
  );
};
