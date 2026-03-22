import { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { HeroFloatingHearts } from './HeroFloatingHearts';
import { StylizedFlower } from './StylizedFlower';
import { colors } from '../constants/theme';

const PHOTO = 184;

function HeroComponent() {
  const { width } = useWindowDimensions();
  const sideBySide = width >= 400;
  const rise = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glow, rise]);

  const heroTranslate = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  const heroOpacity = rise;
  const haloScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const haloOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.85],
  });

  return (
    <View style={styles.screenPad}>
      <View style={styles.cardShadow}>
        <LinearGradient
          colors={['#FFFDF5', colors.cream, colors.honey, colors.sun]}
          locations={[0, 0.25, 0.65, 1]}
          style={styles.cardFace}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'transparent', 'rgba(212,172,13,0.12)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <HeroFloatingHearts />

          <View style={[styles.cornerBloom, styles.cornerTL]} pointerEvents="none">
            <StylizedFlower size={26} petalColor={colors.honey} />
          </View>
          <View style={[styles.cornerBloom, styles.cornerTR]} pointerEvents="none">
            <StylizedFlower size={24} />
          </View>
          <View style={[styles.cornerBloom, styles.cornerBL]} pointerEvents="none">
            <StylizedFlower size={22} petalColor={colors.sun} />
          </View>
          <View style={[styles.cornerBloom, styles.cornerBR]} pointerEvents="none">
            <StylizedFlower size={26} />
          </View>

          <View style={[styles.topBar, styles.layerFront]}>
            <Text style={styles.topBarOrnament}>✦</Text>
            <View style={styles.topBarLine} />
            <View style={styles.topFlowerStrip}>
              <StylizedFlower size={30} />
              <StylizedFlower size={36} petalColor={colors.sun} />
              <StylizedFlower size={30} />
            </View>
            <View style={styles.topBarLine} />
            <Text style={styles.topBarOrnament}>✦</Text>
          </View>

          <Animated.View
            style={[
              sideBySide ? styles.mainRow : styles.mainCol,
              styles.layerFront,
              {
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslate }],
              },
            ]}
          >
            <View style={[styles.photoBlock, sideBySide && styles.photoBlockRow]}>
              <View style={styles.photoStack}>
                <Animated.View
                  style={[
                    styles.halo,
                    {
                      width: PHOTO + 36,
                      height: PHOTO + 36,
                      borderRadius: (PHOTO + 36) / 2,
                      opacity: haloOpacity,
                      transform: [{ scale: haloScale }],
                    },
                  ]}
                />
                <LinearGradient
                  colors={[colors.gold, colors.sun, colors.honey, colors.gold]}
                  locations={[0, 0.35, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientRing}
                >
                  <View style={styles.whiteRing}>
                    <Image
                      source={require('../assets/hero-portrait.png')}
                      style={styles.portrait}
                      contentFit="cover"
                      contentPosition={{ top: '18%', left: '44%' }}
                      transition={400}
                      accessibilityLabel="Retrato principal de María"
                    />
                  </View>
                </LinearGradient>
              </View>
            </View>

            <View style={[styles.textBlock, sideBySide && styles.textBlockRow]}>
              <Text style={[styles.kicker, sideBySide && styles.kickerRow]}>
                Para la mujer más especial
              </Text>
              <LinearGradient
                colors={['rgba(244,208,63,0.35)', 'rgba(247,220,111,0.15)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.nameBand, sideBySide && styles.nameBandRow]}
              >
                <Text style={[styles.name, sideBySide && styles.nameRow]}>María Guadalupe</Text>
                <Text style={[styles.nameAccent, sideBySide && styles.nameAccentRow]}>
                  Mesa Zuniga
                </Text>
              </LinearGradient>
              <Text style={[styles.tagline, sideBySide && styles.taglineRow]}>
                Ingeniera y la persona que pinta mi mundo de amarillo.
              </Text>
            </View>
          </Animated.View>

          <View style={[styles.bottomFlourish, styles.layerFront]}>
            <StylizedFlower size={28} petalColor={colors.honey} />
            <StylizedFlower size={32} />
            <StylizedFlower size={24} petalColor={colors.sun} />
            <StylizedFlower size={32} />
            <StylizedFlower size={28} petalColor={colors.honey} />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

export const Hero = memo(HeroComponent);

const styles = StyleSheet.create({
  screenPad: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardShadow: {
    borderRadius: 28,
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(212, 172, 13, 0.55)',
  },
  cardFace: {
    borderRadius: 26,
    overflow: 'hidden',
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  cornerBloom: {
    position: 'absolute',
    opacity: 0.85,
    zIndex: 2,
  },
  layerFront: {
    zIndex: 3,
  },
  cornerTL: { top: 6, left: 4 },
  cornerTR: { top: 8, right: 6 },
  cornerBL: { bottom: 44, left: 2 },
  cornerBR: { bottom: 46, right: 4 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  topBarOrnament: {
    color: colors.gold,
    fontSize: 12,
    opacity: 0.9,
  },
  topBarLine: {
    flex: 1,
    maxWidth: 36,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(212, 172, 13, 0.45)',
  },
  topFlowerStrip: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 4,
  },
  mainCol: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  photoBlock: {
    alignItems: 'center',
  },
  photoBlockRow: {
    flexShrink: 0,
  },
  photoStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    backgroundColor: colors.sun,
  },
  gradientRing: {
    padding: 5,
    borderRadius: 999,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  whiteRing: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  portrait: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: '#eee',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 14,
    maxWidth: 340,
    width: '100%',
  },
  textBlockRow: {
    marginTop: 0,
    flex: 1,
    maxWidth: undefined,
    alignItems: 'flex-start',
    paddingRight: 4,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    width: '100%',
  },
  kickerRow: {
    textAlign: 'left',
  },
  nameBand: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    width: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  nameRow: {
    fontSize: 28,
    textAlign: 'left',
  },
  nameAccent: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: colors.leafDark,
    textAlign: 'center',
  },
  nameAccentRow: {
    fontSize: 18,
    textAlign: 'left',
  },
  nameBandRow: {
    alignSelf: 'stretch',
  },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  taglineRow: {
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  bottomFlourish: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 172, 13, 0.35)',
  },
});
