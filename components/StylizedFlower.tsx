import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  size?: number;
  centerColor?: string;
  petalColor?: string;
  /** Doble corona de pétalos, más parecida a un ramo real */
  lush?: boolean;
  /** Sombra suave bajo la flor */
  shadow?: boolean;
};

function StylizedFlowerComponent({
  size = 40,
  centerColor = colors.gold,
  petalColor = colors.sun,
  lush = false,
  shadow = false,
}: Props) {
  const petalW = size * 0.36;
  const petalH = size * 0.42;
  const centerS = size * 0.34;

  const outerAngles = lush ? [0, 45, 90, 135, 180, 225, 270, 315] : [0, 60, 120, 180, 240, 300];
  const innerAngles = lush ? [30, 90, 150, 210, 270, 330] : [];

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {shadow ? <View style={[styles.groundShadow, { width: size * 0.85, bottom: -size * 0.08 }]} /> : null}
      {outerAngles.map((deg) => (
        <View
          key={`o-${deg}`}
          style={[
            styles.petal,
            {
              width: petalW,
              height: petalH,
              backgroundColor: petalColor,
              borderRadius: petalW,
              transform: [{ rotate: `${deg}deg` }, { translateY: -size * 0.2 }],
              opacity: 0.96,
            },
          ]}
        />
      ))}
      {lush
        ? innerAngles.map((deg) => (
            <View
              key={`i-${deg}`}
              style={[
                styles.petal,
                {
                  width: petalW * 0.55,
                  height: petalH * 0.52,
                  backgroundColor: colors.honey,
                  borderRadius: petalW,
                  transform: [{ rotate: `${deg}deg` }, { translateY: -size * 0.12 }],
                  opacity: 0.92,
                },
              ]}
            />
          ))
        : null}
      <View
        style={[
          styles.center,
          {
            width: centerS,
            height: centerS,
            borderRadius: centerS / 2,
            backgroundColor: centerColor,
            marginLeft: -centerS / 2,
            marginTop: -centerS / 2,
            borderWidth: lush ? 3 : 2,
          },
        ]}
      />
      {lush ? (
        <View
          style={[
            styles.centerGloss,
            {
              width: centerS * 0.35,
              height: centerS * 0.35,
              borderRadius: centerS * 0.5,
              marginLeft: -centerS * 0.22,
              marginTop: -centerS * 0.28,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

export const StylizedFlower = memo(StylizedFlowerComponent);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  groundShadow: {
    position: 'absolute',
    alignSelf: 'center',
    height: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(44, 24, 16, 0.18)',
  },
  petal: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  centerGloss: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
