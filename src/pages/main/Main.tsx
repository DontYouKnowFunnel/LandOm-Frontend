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
  CtaselectionSectionIcon,
  GenericSectionIcon,
} from "../../components/ui/SectionIcon";

const Main = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-wrap gap-8">
        <HeroSectionIcon />
        <ProblemSectionIcon />
        <TargetSectionIcon />
        <UsecaseSectionIcon />
        <FeatureSectionIcon />
        <ValuePropSectionIcon />
        <TrustSectionIcon />
        <PricingSectionIcon />
        <FaqSectionIcon />
        <CtaselectionSectionIcon />
        <GenericSectionIcon />
      </div>
    </div>
  );
};

export default Main;
