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
