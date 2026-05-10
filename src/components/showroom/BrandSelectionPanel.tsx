import {
  BrandBoardInteractive,
  type BrandBoardInteractiveProps,
  type ShowroomBrandNode,
} from "@/components/showroom/BrandBoardInteractive";

export type BrandSelectionPanelProps = Omit<BrandBoardInteractiveProps, "appearance">;

export type { ShowroomBrandNode };

/**
 * Cam panel görünümü — yüzen overlay kaldırıldığında bile başka rotalarda kullanılabilir.
 */
export function BrandSelectionPanel(props: BrandSelectionPanelProps) {
  return <BrandBoardInteractive appearance="floatingGlass" {...props} />;
}
