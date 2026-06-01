import type { FunnelOverlayItem, LandingProjectState } from "./types";
import ActualWebpageFrame from "./components/ActualWebpageFrame";
import FloatingImproveButton from "./components/FloatingImproveButton";
import FloatingTooltip from "./components/FloatingTooltip";

const buildFunnelOverlayItems = (
  projectState: LandingProjectState
): FunnelOverlayItem[] =>
  projectState.funnels
    .filter((funnel) => Boolean(funnel.selector))
    .map((funnel): FunnelOverlayItem => ({
      sectionName: funnel.sectionName ?? funnel.funnelType,
      selector: funnel.selector ?? "",
      dropRate: funnel.dropRate,
    }));

const WebpageView = ({
  projectState,
  reloadKey,
  showEntryTip,
  onCloseEntryTip,
  onOpenPanel,
  notificationCount,
  showFloatingButton,
}: {
  projectState: LandingProjectState;
  reloadKey: number;
  showEntryTip: boolean;
  onCloseEntryTip: () => void;
  onOpenPanel: () => void;
  notificationCount: number;
  showFloatingButton: boolean;
}) => {
  const funnelOverlayItems = buildFunnelOverlayItems(projectState);

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
      <div className="absolute inset-0 overflow-hidden">
        <ActualWebpageFrame
          title="기존 랜딩페이지"
          pageUrl={projectState.project.url}
          reloadKey={reloadKey}
          overlayItems={funnelOverlayItems}
        />
      </div>

      {showEntryTip && (
        <FloatingTooltip
          title="랜딩페이지를 개선해보세요"
          description="개선안을 기반으로 생성된 랜딩페이지 적용안을 기존 랜딩페이지와 비교해 보세요"
          onClose={onCloseEntryTip}
        />
      )}

      {showFloatingButton && (
        <FloatingImproveButton
          notificationCount={notificationCount}
          onOpenPanel={onOpenPanel}
        />
      )}
    </div>
  );
};

export default WebpageView;
