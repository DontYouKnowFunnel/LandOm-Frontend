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
  sectionId?: number;
  funnelType: FunnelType;
  sectionName?: string;
  reachedSection: number;
  ratio: number;
  avgDuration?: string;
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

const normalizeSectionName = (sectionName: string) =>
  sectionName
    .trim()
    .toLowerCase()
    .replace(/section/g, "")
    .replace(/[^a-z0-9가-힣]/g, "");

const sectionLabelAliasMap: Record<string, string> = {
  hero: "Hero",
  problem: "Problem",
  target: "Target",
  usecase: "Use Case",
  feature: "Feature",
  valueprop: "Value Proposition",
  valueproposition: "Value Proposition",
  trust: "Trust",
  socialproof: "Social Proof",
  pricing: "Pricing",
  price: "Pricing",
  faq: "FAQ",
  cta: "CTA",
  calltoaction: "CTA",
};

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.toLowerCase() !== "section")
    .map((word) =>
      word.length <= 3
        ? word.toUpperCase()
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    )
    .join(" ");

const formatSectionNameLabel = (sectionName: string) => {
  const normalizedSectionName = normalizeSectionName(sectionName);
  const baseLabel =
    sectionLabelAliasMap[normalizedSectionName] || toTitleCase(sectionName);

  return `${baseLabel || "Generic"} Section`;
};

const funnelTypeMatchers: Array<[RegExp, FunnelType]> = [
  [/(hero|히어로)/, FunnelType.HERO],
  [/(problem|문제|pain)/, FunnelType.PROBLEM],
  [/(target|타겟|대상)/, FunnelType.TARGET],
  [/(usecase|case|사례|활용)/, FunnelType.USE_CASE],
  [/(feature|기능)/, FunnelType.FEATURE],
  [/(valueprop|valueproposition|가치|제안)/, FunnelType.VALUE_PROP],
  [/(trust|socialproof|신뢰|review|testimonial|고객후기)/, FunnelType.TRUST],
  [/(pricing|price|요금|가격)/, FunnelType.PRICING],
  [/(faq|자주묻는질문|질문)/, FunnelType.FAQ],
  [/(cta|calltoaction|문의|신청|시작하기|구매)/, FunnelType.CTA_SECTION],
];

export function getFunnelTypeFromSectionName(
  sectionName?: string,
  fallback: FunnelType = FunnelType.GENERIC
): FunnelType {
  if (!sectionName) return fallback;

  const normalizedSectionName = normalizeSectionName(sectionName);
  return (
    funnelTypeMatchers.find(([matcher]) =>
      matcher.test(normalizedSectionName)
    )?.[1] ?? fallback
  );
}

export function getFunnelStageLabel(
  stage: Pick<FunnelStage, "funnelType" | "sectionName">
): string {
  return stage.sectionName?.trim()
    ? formatSectionNameLabel(stage.sectionName)
    : `${getFunnelLabel(stage.funnelType)} Section`;
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
