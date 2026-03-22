import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { StylizedFlower } from './StylizedFlower';
import { colors } from '../constants/theme';

const { width: W, height: H } = Dimensions.get('window');

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  warmPetal: boolean;
  baseOpacity: number;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * W,
    y: Math.random() * H * 0.85,
    size: 16 + Math.random() * 28,
    delay: Math.random() * 4000,
    duration: 14000 + Math.random() * 10000,
    drift: (Math.random() - 0.5) * 40,
    warmPetal: Math.random() > 0.5,
    baseOpacity: 0.15 + Math.random() * 0.35,
  }));
}

function FloatingParticle({ p }: { p: Particle }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const driftX = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(p.baseOpacity)).current;

  useEffect(() => {
    const animFloat = Animated.loop(
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(floatY, {
            toValue: 1,
            duration: p.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(driftX, {
            toValue: 1,
            duration: p.duration * 0.8,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatY, {
            toValue: 0,
            duration: p.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(driftX, {
            toValue: 0,
            duration: p.duration * 0.8,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    const animSpin = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 22000 + p.id * 400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animFloat.start();
    animSpin.start();
    return () => {
      animFloat.stop();
      animSpin.stop();
    };
  }, [p.delay, p.duration, p.id, driftX, floatY, spin]);

  const translateY = floatY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -H * 0.35],
  });
  const translateX = driftX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, p.drift],
  });
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const petalColor = p.warmPetal ? colors.honey : colors.sun;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          left: p.x,
          top: p.y,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    >
      <StylizedFlower size={p.size} petalColor={petalColor} centerColor={colors.gold} />
    </Animated.View>
  );
}

function FloatingFlowersBackgroundComponent() {
  const particles = useMemo(() => makeParticles(26), []);

  return (
    <View style={styles.layer} pointerEvents="none">
      {particles.map((p) => (
        <FloatingParticle key={p.id} p={p} />
      ))}
    </View>
  );
}

export const FloatingFlowersBackground = memo(FloatingFlowersBackgroundComponent);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});
