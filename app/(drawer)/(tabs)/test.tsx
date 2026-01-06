import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import TouchableOpacity from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.55);

/* Demo data */
const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
  "https://images.unsplash.com/photo-1526318472351-bc6c2e62d14c",
];

export default function HeroPlusGalleryDemo() {
  const scrollY = useRef(new Animated.Value(0)).current;

  /* HERO ANIMATIONS */
  const heroScale = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [1, 1.12],
    extrapolate: "clamp",
  });

  const heroOverlayOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.6],
    outputRange: [0.15, 0.7],
    extrapolate: "clamp",
  });

  const heroTextTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.5],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  const heroTextOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.4],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HERO (single image, no gestures) */}
      <View style={styles.hero}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ scale: heroScale }] },
          ]}
        >
          <Image
            source={{ uri: FEATURED_IMAGE }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            priority="high"
          />
        </Animated.View>

        {/* Dark overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.heroOverlay,
            { opacity: heroOverlayOpacity },
          ]}
        />

        {/* Hero text */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.heroContent,
            {
              transform: [{ translateY: heroTextTranslateY }],
              opacity: heroTextOpacity,
            },
          ]}
        >
          <Text style={styles.heroTitle}>Restaurant Dubrovnik</Text>
          <Text style={styles.heroSubtitle}>
            Waterfront dining · Lopud Island
          </Text>
        </Animated.View>
      </View>

      {/* CONTENT */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HERO_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.body}>
          {/* GALLERY SECTION */}
          <Text style={styles.sectionTitle}>Gallery</Text>

          <View style={styles.gallery}>
            <Carousel
              width={SCREEN_WIDTH - 40}
              height={220}
              data={GALLERY_IMAGES}
              pagingEnabled
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              )}
            />
          </View>

          {/* TEXT CONTENT */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>
            This restaurant is located directly on the sea and offers a relaxed
            island atmosphere with Mediterranean cuisine, fresh fish daily, and
            sunset views.
          </Text>

          <Text style={styles.sectionTitle}>Why visit</Text>
          <Text style={styles.paragraph}>
            • Sea-front tables{"\n"}
            • Quiet island setting{"\n"}
            • Family-run tradition{"\n"}
            • Easy boat access from Dubrovnik
          </Text>

          {/* Filler */}
          <Text style={styles.paragraph}>
            Extra content added to allow scrolling all the way to the top and
            fully test hero behavior.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  hero: {
    position: "absolute",
    top: 0,
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: "hidden",
  },

  heroOverlay: {
    backgroundColor: "#000",
  },

  heroContent: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
  },

  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    marginTop: -24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },

  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 20,
  },

  gallery: {
    marginBottom: 24,
  },

  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
});
