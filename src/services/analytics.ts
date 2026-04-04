// import { getRequest } from "./api";

export type FunnelDataItem = {
  id: number;
  ratio: number;
};

export type FunnelAnalyticsResponse = {
  funnelData: FunnelDataItem[];
};

export const getFunnelAnalytics = async (): Promise<FunnelAnalyticsResponse> => {
  const response = await fetch("/mocks/funnelData.json");
  return response.json();
  // Real API:
  // return getRequest("/api/v1/projects/analytics/funnel");
};
