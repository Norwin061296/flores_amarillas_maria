import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

function StorySectionComponent() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 780,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  return (
    <Animated.View style={[styles.wrap, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <LinearGradient
        colors={['rgba(255,249,232,0.9)', 'rgba(247,220,111,0.55)']}
        style={styles.inner}
      >
        <Text style={styles.title}>Un capítulo que brilla</Text>
        <Text style={styles.body}>
          Ver todo lo que has logrado —tu título de Ingeniería de Sistemas— me llena de orgullo. No
          solo eres brillante: eres bondadosa, fuerte y llena de vida.
        </Text>
        <Text style={styles.body}>
          Estas flores amarillas son un pequeño reflejo de la luz que traes a cada día. Gracias por
          compartir tu camino conmigo.
        </Text>
        <Text style={styles.sign}>Con todo mi cariño 💛</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export const StorySection = memo(StorySectionComponent);

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 172, 13, 0.28)',
  },
  inner: {
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: 12,
  },
  sign: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.leafDark,
  },
});
