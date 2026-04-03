import { useQuery } from "@tanstack/react-query";
import { getFunnelAnalytics } from "../../services/analytics";

export const useGetFunnelAnalytics = () => {
  return useQuery({
    queryKey: ["funnelAnalytics"],
    queryFn: getFunnelAnalytics,
  });
};
