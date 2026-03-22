import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { colors } from '../constants/theme';

const BOUQUET = require('../assets/bouquet-sunflowers.png');

/** Dimensiones naturales del PNG (zonas en % sobre esta caja) */
const IMG_W = 438;
const IMG_H = 350;

/**
 * Centros de girasol — % left, top, width, height del recuadro táctil.
 * Ajustados a un ramo denso tipo “domo”; si alguna no calza, mové un punto en el array.
 */
const FLOWER_ZONES = [
  { id: 0, name: 'Girasol arriba al centro', l: 39, t: 0, w: 24, h: 22 },
  { id: 1, name: 'Girasol arriba a la izquierda', l: 6, t: 2, w: 22, h: 22 },
  { id: 2, name: 'Girasol arriba a la derecha', l: 72, t: 2, w: 22, h: 22 },
  { id: 3, name: 'Girasol segunda fila izquierda', l: 0, t: 18, w: 22, h: 24 },
  { id: 4, name: 'Girasol segunda fila centro-izq', l: 26, t: 14, w: 24, h: 26 },
  { id: 5, name: 'Girasol centro', l: 46, t: 16, w: 26, h: 28 },
  { id: 6, name: 'Girasol segunda fila centro-der', l: 70, t: 14, w: 24, h: 26 },
  { id: 7, name: 'Girasol segunda fila derecha', l: 90, t: 20, w: 10, h: 22 },
  { id: 8, name: 'Girasol mitad izquierda', l: 8, t: 36, w: 24, h: 26 },
  { id: 9, name: 'Girasol corazón del ramo', l: 36, t: 34, w: 30, h: 30 },
  { id: 10, name: 'Girasol mitad derecha', l: 68, t: 38, w: 24, h: 26 },
  { id: 11, name: 'Girasol abajo izquierda', l: 4, t: 54, w: 26, h: 28 },
  { id: 12, name: 'Girasol abajo centro-izq', l: 30, t: 56, w: 26, h: 28 },
  { id: 13, name: 'Girasol abajo centro', l: 48, t: 54, w: 28, h: 30 },
  { id: 14, name: 'Girasol abajo centro-der', l: 72, t: 56, w: 24, h: 26 },
  { id: 15, name: 'Girasol abajo derecha', l: 88, t: 50, w: 12, h: 24 },
] as const;

const MESSAGES = [
  'Como este girasol de arriba: vos siempre buscás la luz.',
  'El del costado izquierdo: gracias por acompañarme en los días simples.',
  'El de la derecha: tu risa me llena como el sol.',
  'Este, más escondido: amo los detalles que solo yo conozco de vos.',
  'El del centro-izquierda: admiro cómo enfrentás todo con el corazón.',
  'El del medio: sos mi lugar favorito en el mundo.',
  'El del centro-derecha: quiero seguir eligiéndote una y otra vez.',
  'El que asoma al borde: hasta lo chiquito que hacés me enamora.',
  'El de la mitad izquierda: tu ternura me sostiene.',
  'El corazón del ramo: todo esto es solo una parte de lo que siento por vos.',
  'El de la mitad derecha: sos fuerza y calma a la vez.',
  'El de abajo a la izquierda: prometo estar en los momentos cotidianos también.',
  'El de abajo centro-izquierda: cada día te quiero un poco más.',
  'El de abajo al centro: vos sos mi hogar.',
  'El de abajo centro-derecha: gracias por existir, María.',
  'El último girasol: esto no termina acá; sigue nuestro camino juntos.',
];

function FlowerHotspot({
  zone,
  stageW,
  stageH,
  touched,
  onPress,
}: {
  zone: (typeof FLOWER_ZONES)[number];
  stageW: number;
  stageH: number;
  touched: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.06,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [scale]);

  const handlePress = () => {
    pulse();
    onPress();
  };

  const left = (zone.l / 100) * stageW;
  const top = (zone.t / 100) * stageH;
  const w = (zone.w / 100) * stageW;
  const h = (zone.h / 100) * stageH;
  const corner = Math.min(w, h) * 0.45;
  const smallTarget = zone.w <= 14 || zone.h <= 22;

  return (
    <Animated.View
      style={[
        styles.hotspotWrap,
        {
          left,
          top,
          width: w,
          height: h,
          borderRadius: corner,
          transform: [{ scale }],
          borderColor: touched ? colors.sun : 'rgba(212, 172, 13, 0.45)',
          borderWidth: touched ? 3 : 1,
          borderStyle: touched ? 'solid' : 'dashed',
          backgroundColor: touched ? 'rgba(244, 208, 63, 0.16)' : 'rgba(212, 172, 13, 0.06)',
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${zone.name}. Tocar para un mensaje.`}
        style={styles.hotspotPress}
        hitSlop={smallTarget ? { top: 12, bottom: 12, left: 12, right: 12 } : undefined}
      />
    </Animated.View>
  );
}

function InteractiveBouquetComponent() {
  const { width } = useWindowDimensions();
  const aspect = IMG_H / IMG_W;
  const stageWidth = Math.min(width - 32, 480);
  const stageHeight = stageWidth * aspect;

  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState(MESSAGES[0]);
  const count = useMemo(() => Object.values(touched).filter(Boolean).length, [touched]);

  const onFlowerPress = useCallback((index: number) => {
    setTouched((prev) => ({ ...prev, [index]: true }));
    setMessage(MESSAGES[index] ?? MESSAGES[0]);
  }, []);

  const allTouched = count >= FLOWER_ZONES.length;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(255,255,255,0.97)', 'rgba(255, 236, 179, 0.5)', 'rgba(247, 220, 111, 0.35)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.cardTitle}>Tu ramo de girasoles</Text>
      <Text style={styles.cardHint}>
        Tocá el centro de cada girasol y leé el mensaje que guarda para vos.
      </Text>

      <View
        style={[
          styles.bouquetShell,
          { width: stageWidth, height: stageHeight, alignSelf: 'center' },
        ]}
      >
        <Image
          source={BOUQUET}
          style={[styles.bouquetImage, { width: stageWidth, height: stageHeight }]}
          contentFit="contain"
          accessibilityLabel="Ramo de girasoles interactivo"
        />
        {FLOWER_ZONES.map((z) => (
          <FlowerHotspot
            key={z.id}
            zone={z}
            stageW={stageWidth}
            stageH={stageHeight}
            touched={!!touched[z.id]}
            onPress={() => onFlowerPress(z.id)}
          />
        ))}
      </View>

      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.counter}>
          {count}/{FLOWER_ZONES.length} girasoles
        </Text>
      </View>

      {allTouched ? (
        <Text style={styles.celebrate}>
          ¡Llenaste el ramo de sol! Te amo, María 🌻
        </Text>
      ) : null}
    </View>
  );
}

export const InteractiveBouquet = memo(InteractiveBouquetComponent);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginTop: 8,
    borderRadius: 32,
    paddingTop: 26,
    paddingBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 172, 13, 0.4)',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    paddingHorizontal: 18,
  },
  cardHint: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    paddingHorizontal: 22,
  },
  bouquetShell: {
    marginTop: 18,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },
  bouquetImage: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  hotspotWrap: {
    position: 'absolute',
    overflow: 'hidden',
  },
  hotspotPress: {
    width: '100%',
    height: '100%',
  },
  messageBubble: {
    marginTop: 18,
    marginHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(244, 208, 63, 0.55)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
    fontWeight: '600',
  },
  counter: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    color: colors.inkSoft,
    fontWeight: '700',
  },
  celebrate: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: colors.leafDark,
    paddingHorizontal: 22,
  },
});
