import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { useColors, useTheme, withOpacity } from '@/design-system/ThemeProvider';

export type Shape =
  | {
      type: 'circle';
      x: number;
      y: number;
      r: number;
      opacity?: number;
      blur?: number;
      rotate?: number;
      colorIndex?: number;
    }
  | {
      type: 'arc';
      x: number;
      y: number;
      r: number;
      start: number;
      end: number;
      thickness: number;
      opacity?: number;
      blur?: number;
      rotate?: number;
      colorIndex?: number;
    }
  | {
      type: 'blob';
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
      opacity?: number;
      blur?: number;
      rotate?: number;
      colorIndex?: number;
    };

export type PaletteName = 'brand' | 'sunrise' | 'seafoam' | 'lavender' | 'neutral' | 'custom';

interface ScreenBackgroundProps {
  palette?: PaletteName;
  customPalette?: string[];
  variant?: 'subtle' | 'balanced' | 'bold';
  shapes?: Shape[];
  gradientShape?: 'linear' | 'radial';
  children: React.ReactNode;
}

const intensityMap = {
  subtle: 0.04,
  balanced: 0.07,
  bold: 0.1,
};

function getPalette(
  colors: any,
  palette: PaletteName,
  custom: string[] | undefined,
  intensity: number,
) {
  if (palette === 'custom' && custom?.length) return custom;
  const base = withOpacity(colors.interactive.primary, intensity);
  const light = withOpacity(colors.background.primary, intensity / 2);
  switch (palette) {
    case 'sunrise':
      return [base, light, colors.background.primary];
    case 'seafoam':
      return [base, light, colors.background.primary];
    case 'lavender':
      return [base, light, colors.background.primary];
    case 'neutral':
      return [light, colors.background.primary];
    case 'brand':
    default:
      return [base, colors.background.primary];
  }
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  palette = 'brand',
  customPalette,
  variant = 'subtle',
  shapes,
  gradientShape = 'linear',
  children,
}) => {
  const colors = useColors();
  const { isHighContrast } = useTheme();
  const intensity = intensityMap[variant];

  if (isHighContrast) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background.secondary }}
        pointerEvents="auto"
      >
        {children}
      </SafeAreaView>
    );
  }

  const paletteColors = getPalette(colors, palette, customPalette, intensity);

  const renderShape = (shape: Shape, idx: number) => {
    const color = paletteColors[shape.colorIndex ?? 0] || paletteColors[0];
    const bg = shape.opacity ? withOpacity(color, shape.opacity) : color;
    const style = {
      position: 'absolute' as const,
      left: shape.x,
      top: shape.y,
      transform: shape.rotate ? [{ rotate: `${shape.rotate}deg` }] : undefined,
    };
    if (shape.type === 'circle') {
      const base = (
        <View
          key={idx}
          style={[
            { width: shape.r * 2, height: shape.r * 2, borderRadius: shape.r, backgroundColor: bg },
            style,
          ]}
        />
      );
      if (shape.blur) {
        return (
          <BlurView
            key={idx}
            intensity={shape.blur}
            style={{
              position: 'absolute',
              left: shape.x,
              top: shape.y,
              width: shape.r * 2,
              height: shape.r * 2,
            }}
          >
            {base}
          </BlurView>
        );
      }
      return base;
    }
    if (shape.type === 'blob') {
      return (
        <View
          key={idx}
          style={[
            { width: shape.w, height: shape.h, borderRadius: shape.radius, backgroundColor: bg },
            style,
          ]}
        />
      );
    }
    if (shape.type === 'arc') {
      const path = describeArc(shape.r, shape.r, shape.r, shape.start, shape.end);
      return (
        <Svg key={idx} width={shape.r * 2} height={shape.r * 2} style={style}>
          <Path d={path} strokeWidth={shape.thickness} stroke={bg} fill="none" />
        </Svg>
      );
    }
    return null;
  };

  const defaultShapes: Shape[] = [
    { type: 'circle', x: -80, y: -80, r: 120, opacity: intensity },
    { type: 'blob', x: 200, y: 100, w: 160, h: 160, radius: 80, opacity: intensity },
    { type: 'circle', x: 250, y: 500, r: 100, opacity: intensity / 1.5 },
  ];

  const usedShapes = shapes ?? defaultShapes;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        pointerEvents="none"
        colors={paletteColors as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
        start={gradientShape === 'linear' ? { x: 0, y: 0 } : { x: 0.5, y: 0 }}
        end={gradientShape === 'linear' ? { x: 1, y: 1 } : { x: 0.5, y: 1 }}
      />
      <View pointerEvents="none">{usedShapes.map(renderShape)}</View>
      <SafeAreaView style={{ flex: 1 }} pointerEvents="auto">
        {children}
      </SafeAreaView>
    </View>
  );
};

export default ScreenBackground;

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
