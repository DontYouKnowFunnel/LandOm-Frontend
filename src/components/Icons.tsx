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

export const AiIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Icon icon="lucide:sparkles" className={className} {...(props as object)} />
  );
};

export const SortIcon = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return <Icon icon="uil:sort" className={className} {...(props as object)} />;
};
