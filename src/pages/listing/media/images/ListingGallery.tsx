// File: src/pages/listing/media/images/ListingGallery.tsx
// Stable image carousel using react-native-reanimated-carousel (no gaps)

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Easing } from 'react-native-reanimated';
import TouchableHaptic from '@/components/ui/TouchableHaptic';

import ListingImageBadges from './ListingImageBadges';
import type { GalleryProps } from '../../types';

const GALLERY_HEIGHT = 240;
const PAGE_HORIZONTAL_PADDING = 12; // must match [id].tsx ScrollView padding

export default function ListingGallery({
  images,
  featured,
  popular,
  seasonal,
  priceLevel,
  autoSlide = true,
  autoSlideInterval = 4000,
}: GalleryProps) {
  const { width: screenWidth } = useWindowDimensions();
  const carouselWidth = screenWidth - PAGE_HORIZONTAL_PADDING * 2;

  const data = useMemo(
    () => (images || []).filter(Boolean),
    [images]
  );

  const carouselRef = useRef<ICarouselInstance | null>(null);
  const [index, setIndex] = useState(0);
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  // Reset state when images change (navigating to new listing)
  useEffect(() => {
    setIndex(0);
    badgeOpacity.setValue(0);
  }, [images, badgeOpacity]);

  // Preload all gallery images for instant loading
  useEffect(() => {
    if (data.length > 0) {
      Image.prefetch(data);
    }
  }, [data]);

  // Smooth fade-in for badges
  useEffect(() => {
    Animated.timing(badgeOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [badgeOpacity, images]);

  if (!data.length) return null;

  const goPrev = () => {
    if (index > 0) {
      carouselRef.current?.scrollTo({
        index: index - 1,
        animated: true,
      });
    }
  };

  const goNext = () => {
    if (index < data.length - 1) {
      carouselRef.current?.scrollTo({
        index: index + 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.root}>
      {/* CAROUSEL */}
      <Carousel
        ref={carouselRef}
        width={carouselWidth}
        height={GALLERY_HEIGHT}
        data={data}
        loop={true}
        pagingEnabled
        autoPlay={autoSlide && data.length > 1}
        autoPlayInterval={autoSlideInterval}
        withAnimation={{
          type: 'timing',
          config: {
            duration: 600,
            easing: Easing.out(Easing.cubic),
          },
        }}
        onSnapToItem={setIndex}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              contentFit="cover"
              transition={100}
              cachePolicy="memory-disk"
              priority="high"
            />
          </View>
        )}
      />

      {/* OVERLAYS */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: badgeOpacity }]} pointerEvents="box-none">
        <ListingImageBadges
          featured={featured}
          popular={popular}
          seasonal={seasonal}
          priceLevel={priceLevel}
        />

        {data.length > 1 && (
          <>
            {index > 0 && (
              <TouchableHaptic
                style={[styles.arrow, styles.arrowLeft]}
                onPress={goPrev}
                haptic="light"
              >
                <ChevronLeft size={32} color="#fff" strokeWidth={3} />
              </TouchableHaptic>
            )}

            {index < data.length - 1 && (
              <TouchableHaptic
                style={[styles.arrow, styles.arrowRight]}
                onPress={goNext}
                haptic="light"
              >
                <ChevronRight size={32} color="#fff" strokeWidth={3} />
              </TouchableHaptic>
            )}

            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {index + 1}/{data.length}
              </Text>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: GALLERY_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },

  slide: {
    width: '100%',
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowLeft: {
    left: 12,
  },

  arrowRight: {
    right: 12,
  },

  counterBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
