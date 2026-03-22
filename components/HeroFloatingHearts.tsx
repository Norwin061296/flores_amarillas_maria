import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type HeartSpec = {
  id: number;
  /** % del ancho del contenedor */
  l: number;
  /** % del alto del contenedor */
  t: number;
  size: number;
  delay: number;
  period: number;
  ampY: number;
  ampX: number;
  rot: number;
};

/** Corazones repartidos en la zona central de la tarjeta (porcentajes) */
function buildHearts(): HeartSpec[] {
  return [
    { id: 0, l: 18, t: 40, size: 14, delay: 0, period: 2600, ampY: 10, ampX: 4, rot: 10 },
    { id: 1, l: 28, t: 52, size: 11, delay: 180, period: 3100, ampY: 8, ampX: 6, rot: 8 },
    { id: 2, l: 44, t: 36, size: 16, delay: 400, period: 2800, ampY: 12, ampX: 3, rot: 12 },
    { id: 3, l: 58, t: 48, size: 12, delay: 90, period: 3400, ampY: 9, ampX: 5, rot: 9 },
    { id: 4, l: 72, t: 42, size: 15, delay: 520, period: 3000, ampY: 11, ampX: 4, rot: 11 },
    { id: 5, l: 82, t: 55, size: 10, delay: 260, period: 3600, ampY: 7, ampX: 5, rot: 7 },
    { id: 6, l: 12, t: 58, size: 13, delay: 640, period: 2900, ampY: 10, ampX: 3, rot: 10 },
    { id: 7, l: 36, t: 44, size: 12, delay: 300, period: 3200, ampY: 8, ampX: 6, rot: 8 },
    { id: 8, l: 50, t: 58, size: 14, delay: 750, period: 2700, ampY: 13, ampX: 4, rot: 12 },
    { id: 9, l: 66, t: 38, size: 11, delay: 120, period: 3300, ampY: 9, ampX: 5, rot: 9 },
    { id: 10, l: 78, t: 50, size: 13, delay: 480, period: 3050, ampY: 10, ampX: 4, rot: 10 },
    { id: 11, l: 24, t: 66, size: 10, delay: 900, period: 3500, ampY: 8, ampX: 5, rot: 8 },
    { id: 12, l: 52, t: 68, size: 12, delay: 200, period: 3150, ampY: 9, ampX: 4, rot: 9 },
    { id: 13, l: 40, t: 62, size: 15, delay: 560, period: 2850, ampY: 11, ampX: 3, rot: 11 },
    { id: 14, l: 88, t: 38, size: 11, delay: 40, period: 3250, ampY: 8, ampX: 6, rot: 8 },
    { id: 15, l: 8, t: 48, size: 12, delay: 680, period: 2950, ampY: 10, ampX: 4, rot: 10 },
    { id: 16, l: 62, t: 62, size: 13, delay: 340, period: 3080, ampY: 9, ampX: 5, rot: 9 },
    { id: 17, l: 46, t: 50, size: 17, delay: 220, period: 2750, ampY: 12, ampX: 4, rot: 13 },
  ];
}

function FloatingHeart({ h }: { h: HeartSpec }) {
  const phase = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const wave = Animated.loop(
      Animated.sequence([
        Animated.delay(h.delay),
        Animated.timing(phase, {
          toValue: 1,
          duration: h.period,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(phase, {
          toValue: 0,
          duration: h.period,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const beat = Animated.loop(
      Animated.sequence([
        Animated.delay(h.delay + 100),
        Animated.timing(pulse, {
          toValue: 1,
          duration: h.period * 0.35,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: h.period * 0.45,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(h.period * 0.2),
      ])
    );
    const twinkle = Animated.loop(
      Animated.sequence([
        Animated.delay(h.delay + 200),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: h.period * 0.4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.45,
          duration: h.period * 0.5,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    wave.start();
    beat.start();
    twinkle.start();
    return () => {
      wave.stop();
      beat.stop();
      twinkle.stop();
    };
  }, [h.delay, h.period, phase, pulse, shimmer]);

  const translateY = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -h.ampY],
  });
  const translateX = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [0, h.ampX],
  });
  const rotate = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${h.rot}deg`, `${h.rot}deg`],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.18],
  });

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.heart,
        {
          left: `${h.l}%`,
          top: `${h.t}%`,
          fontSize: h.size,
          opacity: shimmer,
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
        },
      ]}
    >
      💛
    </Animated.Text>
  );
}

function HeroFloatingHeartsComponent() {
  const hearts = useMemo(() => buildHearts(), []);

  return (
    <View style={styles.layer} pointerEvents="none">
      {hearts.map((h) => (
        <FloatingHeart key={h.id} h={h} />
      ))}
    </View>
  );
}

export const HeroFloatingHearts = memo(HeroFloatingHeartsComponent);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  heart: {
    position: 'absolute',
    marginLeft: -8,
    marginTop: -8,
  },
});
