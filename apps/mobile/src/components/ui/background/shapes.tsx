import React, { useEffect } from 'react';
import Svg, { Path, Defs, RadialGradient, Stop, Rect, Circle } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export type CircleShape = {
  kind: 'circle';
  x: number;
  y: number;
  r: number;
  opacity: number;
  rotate?: number;
  colorIndex?: number;
};

export type ArcShape = {
  kind: 'arc';
  x: number;
  y: number;
  r: number;
  start: number;
  end: number;
  thickness: number;
  opacity: number;
  rotate?: number;
  colorIndex?: number;
};

export type BlobShape = {
  kind: 'blob';
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  opacity: number;
  rotate?: number;
  colorIndex?: number;
};

export type AnyShape = CircleShape | ArcShape | BlobShape;

interface ShapeProps {
  shape: AnyShape;
  color: string;
  phase: SharedValue<number>;
  overshoot: number;
  drift?: { amplitude?: number; periodMs?: number };
  index: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const ShapeComponent: React.FC<ShapeProps> = ({
  shape,
  color,
  phase,
  overshoot,
  drift,
  index,
}) => {
  const driftProgress = useSharedValue(0);

  useEffect(() => {
    if (drift && (drift.amplitude || 0) > 0 && (drift.periodMs || 0) > 0) {
      driftProgress.value = withRepeat(withTiming(1, { duration: drift.periodMs }), -1, true);
    }
  }, [drift]);

  const style = useAnimatedStyle(() => {
    const dx = drift
      ? Math.cos(driftProgress.value * 2 * Math.PI + index) * (drift.amplitude || 0)
      : 0;
    const dy = drift
      ? Math.sin(driftProgress.value * 2 * Math.PI + index) * (drift.amplitude || 0)
      : 0;
    const rotate = (shape.rotate || 0) + phase.value * 8;
    const scale = 1 + overshoot * phase.value;
    return {
      transform: [
        { translateX: dx + phase.value * 10 },
        { translateY: dy - phase.value * 10 },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const base = {
    position: 'absolute' as const,
    left: shape.x,
    top: shape.y,
  };

  const id = `g${index}`;

  if (shape.kind === 'circle') {
    const opacity = clampOpacity(shape.opacity);
    return (
      <AnimatedSvg
        pointerEvents="none"
        width={shape.r * 2}
        height={shape.r * 2}
        style={[base, style]}
      >
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={shape.r} cy={shape.r} r={shape.r} fill={`url(#${id})`} />
      </AnimatedSvg>
    );
  }
  if (shape.kind === 'blob') {
    const opacity = clampOpacity(shape.opacity);
    const r = Math.max(shape.w, shape.h) / 2;
    return (
      <AnimatedSvg pointerEvents="none" width={shape.w} height={shape.h} style={[base, style]}>
        <Defs>
          <RadialGradient
            id={id}
            cx={shape.w / 2}
            cy={shape.h / 2}
            r={r}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect
          width={shape.w}
          height={shape.h}
          rx={shape.radius}
          ry={shape.radius}
          fill={`url(#${id})`}
        />
      </AnimatedSvg>
    );
  }
  if (shape.kind === 'arc') {
    const path = describeArc(shape.r, shape.r, shape.r, shape.start, shape.end);
    const mainOpacity = clampOpacity(shape.opacity);
    const shadowOpacity = clampOpacity(shape.opacity * 0.5);
    return (
      <AnimatedSvg
        pointerEvents="none"
        width={shape.r * 2}
        height={shape.r * 2}
        style={[base, style]}
      >
        <Path
          d={path}
          strokeWidth={shape.thickness * 1.8}
          stroke={color}
          strokeOpacity={shadowOpacity}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={path}
          strokeWidth={shape.thickness}
          stroke={color}
          strokeOpacity={mainOpacity}
          fill="none"
          strokeLinecap="round"
        />
      </AnimatedSvg>
    );
  }
  return null;
};

export function deriveWaterPath(kind: string, seed: number, rand?: () => number) {
  const r = rand || xorshift(seed + kind.charCodeAt(0));
  const jitter = () => (r() - 0.5) * 6;
  return { x: jitter(), y: jitter(), rotate: jitter() * 2 };
}

function xorshift(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

function clampOpacity(v: number) {
  return Math.min(0.14, Math.max(0.02, v));
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
