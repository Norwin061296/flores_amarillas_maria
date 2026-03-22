import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { gallerySources } from '../constants/gallery';
import { colors } from '../constants/theme';

const COLS = 4;
const GAP = 6;
const PAD = 10;

function GalleryThumb({
  index,
  source,
  thumbSize,
  onOpen,
}: {
  index: number;
  source: (typeof gallerySources)[number];
  thumbSize: number;
  onOpen: () => void;
}) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      delay: index * 45,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [{ translateY }, { rotate: index % 2 === 0 ? '-1deg' : '1deg' }],
      }}
    >
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Ampliar foto ${index + 1}`}
        style={({ pressed }) => [styles.tile, { width: thumbSize }, pressed && styles.tilePressed]}
        android_ripple={{ color: 'rgba(244,208,63,0.35)' }}
      >
        <Image
          source={source}
          style={[styles.thumbImage, { height: thumbSize * 1.02 }]}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(44,24,16,0.35)']}
          style={styles.thumbGradient}
        />
        <Text style={styles.tapHint}>Ver</Text>
        <View style={styles.tileShine} pointerEvents="none" />
      </Pressable>
    </Animated.View>
  );
}

function PhotoGalleryComponent() {
  const { width, height } = useWindowDimensions();
  const thumbSize = (width - PAD * 2 - GAP * (COLS - 1)) / COLS;
  const [selected, setSelected] = useState<number | null>(null);
  const backdrop = useRef(new Animated.Value(0)).current;
  const card = useRef(new Animated.Value(0)).current;

  const runOpenAnim = useCallback(() => {
    backdrop.setValue(0);
    card.setValue(0);
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(card, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdrop, card]);

  const runCloseAnim = useCallback(
    (after?: () => void) => {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(card, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) after?.();
      });
    },
    [backdrop, card]
  );

  const openAt = useCallback(
    (i: number) => {
      setSelected(i);
      requestAnimationFrame(runOpenAnim);
    },
    [runOpenAnim]
  );

  const close = useCallback(() => {
    runCloseAnim(() => setSelected(null));
  }, [runCloseAnim]);

  const backdropOpacity = backdrop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const cardScale = card.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });
  const cardOpacity = card;

  const titleShimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleShimmer, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(titleShimmer, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [titleShimmer]);

  const titleScale = titleShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <View style={styles.section}>
      <Animated.Text style={[styles.sectionTitle, { transform: [{ scale: titleScale }] }]}>
        Momentos que me encantan
      </Animated.Text>
      <Text style={styles.sectionSub}>
        Toca una foto para verla grande. Cada una es un tesoro.
      </Text>
      <View style={[styles.grid, { paddingHorizontal: PAD, gap: GAP }]}>
        {gallerySources.map((src, i) => (
          <GalleryThumb
            key={i}
            index={i}
            source={src}
            thumbSize={thumbSize}
            onOpen={() => openAt(i)}
          />
        ))}
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <View style={[styles.modalRoot, { width, height }]}>
          <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Cerrar" />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalCard,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
                width,
                height,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.modalImageShell}>
              {selected !== null ? (
                <Image
                  source={gallerySources[selected]}
                  style={{ width, height }}
                  contentFit="contain"
                  transition={200}
                  accessibilityLabel={`Foto ${selected + 1} ampliada`}
                />
              ) : null}
            </View>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              style={styles.modalCaptionBar}
              pointerEvents="none"
            />
            <Pressable style={[styles.closeBtn, { top: Math.max(12, height * 0.02) }]} onPress={close} accessibilityRole="button">
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
            {selected !== null ? (
              <Text style={[styles.modalCaption, { bottom: Math.max(14, height * 0.02) }]}>
                Foto {selected + 1} de {gallerySources.length}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

export const PhotoGallery = memo(PhotoGalleryComponent);

const styles = StyleSheet.create({
  section: {
    marginTop: 36,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  sectionSub: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  tile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(212, 172, 13, 0.3)',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  tilePressed: {
    opacity: 0.88,
  },
  thumbImage: {
    width: '100%',
    backgroundColor: '#f3e9c8',
  },
  thumbGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
  },
  tapHint: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tileShine: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 11,
  },
  modalRoot: {
    flex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 12, 8, 0.88)',
  },
  modalCard: {
    zIndex: 2,
    overflow: 'hidden',
    backgroundColor: '#050403',
  },
  modalImageShell: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050403',
  },
  modalCaptionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  modalCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
