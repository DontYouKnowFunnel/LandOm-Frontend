// import { getRequest } from "./api";

export type FunnelDataItem = {
  id: number;
  ratio: number;
};

export type FunnelAnalyticsResponse = {
  funnelData: FunnelDataItem[];
};

export const getFunnelAnalytics = async () => {
  const response = await fetch("/mocks/funnelData.json");
  return response.json() as Promise<FunnelAnalyticsResponse>;
  // Real API:
  // return getRequest<FunnelAnalyticsResponse>("/api/v1/projects/analytics/funnel");
};
