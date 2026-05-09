import {
  HeroSectionIcon,
  ProblemSectionIcon,
  TargetSectionIcon,
  UsecaseSectionIcon,
  FeatureSectionIcon,
  ValuePropSectionIcon,
  TrustSectionIcon,
  PricingSectionIcon,
  FaqSectionIcon,
  CtaSectionIcon,
  GenericSectionIcon,
} from "@component/ui/SectionIcon";
import type { ComponentType } from "react";

export enum FunnelType {
  HERO = "HERO",
  PROBLEM = "PROBLEM",
  TARGET = "TARGET",
  USE_CASE = "USE_CASE",
  FEATURE = "FEATURE",
  VALUE_PROP = "VALUE_PROP",
  TRUST = "TRUST",
  PRICING = "PRICING",
  FAQ = "FAQ",
  CTA_SECTION = "CTA_SECTION",
  GENERIC = "GENERIC",
}

export type FunnelStage = {
  id: number;
  funnelType: FunnelType;
  reachedSection: number;
  ratio: number;
};

export const funnelLabelMap: Record<FunnelType, string> = {
  [FunnelType.HERO]: "Hero",
  [FunnelType.PROBLEM]: "Problem",
  [FunnelType.TARGET]: "Target",
  [FunnelType.USE_CASE]: "Use Case",
  [FunnelType.FEATURE]: "Feature",
  [FunnelType.VALUE_PROP]: "Value Proposition",
  [FunnelType.TRUST]: "Trust",
  [FunnelType.PRICING]: "Pricing",
  [FunnelType.FAQ]: "FAQ",
  [FunnelType.CTA_SECTION]: "CTA",
  [FunnelType.GENERIC]: "Generic",
};

export function getFunnelLabel(type: FunnelType): string {
  return funnelLabelMap[type];
}

type SectionIconComponent = ComponentType<{ className?: string }>;

export const funnelIconMap: Record<FunnelType, SectionIconComponent> = {
  [FunnelType.HERO]: HeroSectionIcon,
  [FunnelType.PROBLEM]: ProblemSectionIcon,
  [FunnelType.TARGET]: TargetSectionIcon,
  [FunnelType.USE_CASE]: UsecaseSectionIcon,
  [FunnelType.FEATURE]: FeatureSectionIcon,
  [FunnelType.VALUE_PROP]: ValuePropSectionIcon,
  [FunnelType.TRUST]: TrustSectionIcon,
  [FunnelType.PRICING]: PricingSectionIcon,
  [FunnelType.FAQ]: FaqSectionIcon,
  [FunnelType.CTA_SECTION]: CtaSectionIcon,
  [FunnelType.GENERIC]: GenericSectionIcon,
};
