import type { HTMLAttributes, ReactNode } from "react";
import {
  HeroIcon,
  ProblemIcon,
  TargetIcon,
  UsecaseIcon,
  FeatureIcon,
  ValuePropIcon,
  TrustIcon,
  PricingIcon,
  FaqIcon,
  CtaselectionIcon,
  GenericIcon,
} from "../Icons";

// className은 외부 래퍼(flex-col 컨테이너)에 적용됩니다.
// 크기 조절 시 scale-* 유틸리티 사용 예: <HeroSectionIcon className="scale-75" />
type SectionIconProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

function SectionIconBase({
  bgClass,
  icon,
  label,
  showLabel = false,
  className,
  ...props
}: {
  bgClass: string;
  icon: ReactNode;
  label: ReactNode;
  showLabel?: boolean;
} & SectionIconProps) {
  return (
    <div
      className={"inline-flex flex-col items-center gap-1 " + (className ?? "")}
      {...props}
    >
      <div
        className={
          "w-8 h-8 rounded-lg flex items-center justify-center " + bgClass
        }
      >
        {icon}
      </div>
      {showLabel ? (
        <span className="text-xs font-medium text-black text-center leading-3.75">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export const HeroSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-blue-500"
    icon={<HeroIcon className="text-[16px] text-white" />}
    label="HERO"
    {...props}
  />
);

export const ProblemSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-red-500"
    icon={<ProblemIcon className="text-[16px] text-white" />}
    label="PROBLEM"
    {...props}
  />
);

export const TargetSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-orange-500"
    icon={<TargetIcon className="text-[16px] text-white" />}
    label="TARGET"
    {...props}
  />
);

export const UsecaseSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-blue-600"
    icon={<UsecaseIcon className="text-[16px] text-white" />}
    label="USECASE"
    {...props}
  />
);

export const FeatureSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-purple-500"
    icon={<FeatureIcon className="text-[16px] text-white" />}
    label="FEATURE"
    {...props}
  />
);

export const ValuePropSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-teal-500"
    icon={<ValuePropIcon className="text-[16px] text-white" />}
    label={
      <>
        VALUE
        <br />
        PROP
      </>
    }
    {...props}
  />
);

export const TrustSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-emerald-500"
    icon={<TrustIcon className="text-[16px] text-white" />}
    label="TRUST"
    {...props}
  />
);

export const PricingSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-amber-500"
    icon={<PricingIcon className="text-[16px] text-white" />}
    label="PRICING"
    {...props}
  />
);

export const FaqSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-cyan-500"
    icon={<FaqIcon className="text-[16px] text-white" />}
    label="FAQ"
    {...props}
  />
);

export const CtaSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-pink-500"
    icon={<CtaselectionIcon className="text-[16px] text-white" />}
    label={
      <>
        CTA
        <br />
        SECTION
      </>
    }
    {...props}
  />
);

export const GenericSectionIcon = (props: SectionIconProps) => (
  <SectionIconBase
    bgClass="bg-slate-500"
    icon={<GenericIcon className="text-[16px] text-white" />}
    label="GENERIC"
    {...props}
  />
);
