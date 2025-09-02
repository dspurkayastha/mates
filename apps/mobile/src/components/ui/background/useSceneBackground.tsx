import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSharedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { deriveWaterPath } from './shapes';

export type SceneTheme = {
  key: string;
  gradient: {
    type: 'linear' | 'radial';
    stops: string[];
    angle?: number;
  };
  shapes: Array<
    | {
        kind: 'circle';
        x: number;
        y: number;
        r: number;
        opacity: number;
        rotate?: number;
        colorIndex?: number;
      }
    | {
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
      }
    | {
        kind: 'blob';
        x: number;
        y: number;
        w: number;
        h: number;
        radius: number;
        opacity: number;
        rotate?: number;
        colorIndex?: number;
      }
  >;
  noise?: boolean;
  intensity?: 'subtle' | 'balanced' | 'bold';
  drift?: {
    amplitude?: number;
    periodMs?: number;
  };
  swirl?: {
    durationInMs?: number;
    durationOutMs?: number;
    overshoot?: number;
    staggerMs?: number;
  };
  seed?: number;
};

const intensityScale = {
  subtle: 0.8,
  balanced: 1,
  bold: 1.2,
} as const;

function clampOpacity(v: number) {
  return Math.min(0.12, Math.max(0.02, v));
}

function stableHash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
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

export interface SceneBackgroundContextType {
  theme: SceneTheme | null;
  version: number;
  register: (theme: SceneTheme) => void;
  sceneTransition: SharedValue<number>;
}

const SceneBackgroundContext = createContext<SceneBackgroundContextType | undefined>(undefined);

export const SceneBackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<SceneTheme | null>(null);
  const [version, setVersion] = useState(0);
  const sceneTransition = useSharedValue(0);

  const register = useCallback((t: SceneTheme) => {
    const seed = t.seed ?? stableHash(t.key);
    const rand = xorshift(seed);
    const intensity = intensityScale[t.intensity ?? 'balanced'];
    const shapes = (t.shapes || []).map((s, idx) => {
      const jitter = deriveWaterPath(s.kind, seed + idx, rand);
      if ('opacity' in s) {
        s.opacity = clampOpacity((s.opacity ?? 0.05) * intensity);
      }
      return {
        ...s,
        x: s.x + jitter.x,
        y: s.y + jitter.y,
        rotate: (s.rotate ?? 0) + jitter.rotate,
      } as typeof s;
    });
    setTheme({ ...t, shapes });
    setVersion((v) => v + 1);
  }, []);

  return (
    <SceneBackgroundContext.Provider value={{ theme, version, register, sceneTransition }}>
      {children}
    </SceneBackgroundContext.Provider>
  );
};

export const useSceneBackground = (theme: SceneTheme) => {
  const ctx = useContext(SceneBackgroundContext);
  if (!ctx) throw new Error('useSceneBackground must be used within SceneBackgroundProvider');
  useFocusEffect(
    useCallback(() => {
      ctx.register(theme);
    }, [ctx, theme]),
  );
  return ctx.sceneTransition;
};

export const useSceneBackgroundContext = () => {
  const ctx = useContext(SceneBackgroundContext);
  if (!ctx) throw new Error('SceneBackgroundContext not found');
  return ctx;
};
