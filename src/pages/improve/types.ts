import type { FunnelType } from "../../models/funnel";

export type ProjectContext = {
  id: number;
  name: string;
  url: string;
};

export type FunnelSession = {
  id: string;
  device: string;
  stayTime: string;
};

export type FunnelSection = {
  id: string;
  sectionId?: number;
  rank: number;
  name: string;
  sectionName?: string;
  selector?: string;
  dropRate: number;
  avgStayTime: string;
  reachedUsers: number;
  reachRate: number;
  funnelType: FunnelType;
  sessions: FunnelSession[];
};

export type FunnelOverlayItem = {
  sectionName: string;
  selector: string;
  dropRate: number;
};

export type Improvement = {
  id: number;
  title: string;
  problem: string;
  changes: string[];
  effect: string;
  wireframe?: string;
};

export type LandingPreviewCode = {
  html: string;
  css: string;
};

export type AppliedCodegenVersion = {
  key: string;
  displayNumber: number;
  sectionId?: number;
  generatedAt?: string;
  usedRecommendationTitles: string[];
  generatedCode: LandingPreviewCode;
};

export type LandingProjectState = {
  project: ProjectContext;
  funnels: FunnelSection[];
  improvements: Improvement[];
  sourceCode?: LandingPreviewCode;
  generatedCode: LandingPreviewCode;
};

export type ImprovePreviewView = "webpage" | "improvement";
