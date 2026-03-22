import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

const { width: W, height: H } = Dimensions.get('window');

type Spark = { id: number; x: number; y: number; size: number; delay: number; phase: number };

function makeSparkles(n: number): Spark[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * W,
    y: Math.random() * H * 0.92,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 2800,
    phase: Math.random(),
  }));
}

function SparkleDot({ s }: { s: Spark }) {
  const twinkle = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(s.delay),
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 900 + s.phase * 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0.25,
          duration: 1100 + s.phase * 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    a.start();
    return () => a.stop();
  }, [s.delay, s.phase, twinkle]);

  const scale = twinkle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.35],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dot,
        {
          left: s.x,
          top: s.y,
          width: s.size,
          height: s.size,
          borderRadius: s.size / 2,
          opacity: twinkle,
          transform: [{ scale }],
          backgroundColor: s.phase > 0.5 ? colors.sun : colors.honey,
        },
      ]}
    />
  );
}

function GoldenSparklesComponent() {
  const sparks = useMemo(() => makeSparkles(28), []);

  return (
    <View style={styles.layer} pointerEvents="none">
      {sparks.map((s) => (
        <SparkleDot key={s.id} s={s} />
      ))}
    </View>
  );
}

export const GoldenSparkles = memo(GoldenSparklesComponent);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
});
