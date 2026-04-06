import { useEffect } from "react";
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
import { getProjects } from "../../services/project";

const Main = () => {
  useEffect(() => {
    const setProjectKey = async () => {
      try {
        const projectsResponse = await getProjects();
        console.log(projectsResponse);
        const firstProjectApiKey = projectsResponse.projects[0].apiKey;
        if (firstProjectApiKey)
          sessionStorage.setItem("projectKey", firstProjectApiKey);
      } catch (e) {
        return;
      }
    };

    void setProjectKey();
  }, []);

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
