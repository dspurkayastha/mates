import { useColors, withOpacity } from '@/design-system/ThemeProvider';
import Tokens from '@/design-system/tokens';

export type PaletteName =
  | 'brandWatercolor'
  | 'seafoamWash'
  | 'sunriseWash'
  | 'lavenderWash'
  | 'neutralHint';

type ThemeColors = ReturnType<typeof useColors>;
const { BaseColors } = Tokens;

const getPalette = (colors: ThemeColors, name: PaletteName): string[] => {
  switch (name) {
    case 'seafoamWash':
      return [
        withOpacity(colors.background.primary, 0.98),
        withOpacity(BaseColors.success[400], 0.1),
        withOpacity(BaseColors.info[400], 0.08),
        withOpacity(colors.interactive.primary, 0.05),
        withOpacity(colors.text.brand, 0.04),
      ];
    case 'sunriseWash':
      return [
        withOpacity(colors.background.primary, 0.98),
        withOpacity(BaseColors.warning[400], 0.1),
        withOpacity(BaseColors.error[400], 0.08),
        withOpacity(BaseColors.error[100], 0.06),
        withOpacity(colors.interactive.primary, 0.04),
      ];
    case 'lavenderWash':
      return [
        withOpacity(colors.background.primary, 0.98),
        withOpacity(BaseColors.info[400], 0.1),
        withOpacity(BaseColors.info[100], 0.08),
        withOpacity(colors.interactive.primary, 0.05),
        withOpacity(colors.text.brand, 0.04),
      ];
    case 'neutralHint':
      return [
        withOpacity(colors.background.primary, 0.99),
        withOpacity(colors.interactive.primary, 0.05),
        withOpacity(colors.text.secondary, 0.03),
      ];
    case 'brandWatercolor':
    default:
      return [
        withOpacity(colors.background.primary, 0.98),
        withOpacity(colors.interactive.primary, 0.1),
        withOpacity(colors.text.brand, 0.08),
        withOpacity(BaseColors.info[400], 0.06),
        withOpacity(BaseColors.success[400], 0.06),
        withOpacity(BaseColors.warning[400], 0.04),
      ];
  }
};

export function usePalette(name: PaletteName): string[] {
  const colors = useColors();
  return getPalette(colors, name);
}

export const getIntensityMultiplier = (intensity: 'subtle' | 'balanced' | 'bold' = 'balanced') => {
  const mult = { subtle: 0.8, balanced: 1, bold: 1.2 }[intensity];
  return mult;
};
