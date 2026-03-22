import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FloatingFlowersBackground } from './components/FloatingFlowersBackground';
import { GoldenSparkles } from './components/GoldenSparkles';
import { Hero } from './components/Hero';
import { InteractiveBouquet } from './components/InteractiveBouquet';
import { PhotoGallery } from './components/PhotoGallery';
import { StorySection } from './components/StorySection';
import { colors } from './constants/theme';

export default function App() {
  return (
    <View style={styles.root}>
      <FloatingFlowersBackground />
      <GoldenSparkles />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Hero />
        <StorySection />
        <InteractiveBouquet />
        <PhotoGallery />
        <Text style={styles.footer}>Hecho con amor · Flores amarillas para ti</Text>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  footer: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13,
    color: colors.inkSoft,
    fontWeight: '600',
  },
});
