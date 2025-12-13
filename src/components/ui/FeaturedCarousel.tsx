// @/components/ui/FeaturedCarousel.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Pressable,
  View,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ColorTheme } from '@/theme/colors';
import { typography } from '@/theme/typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 180;

type FeaturedItem = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  onPress: () => void;
};

type Props = {
  theme: ColorTheme;
  items: FeaturedItem[];
  title?: string;
};

/**
 * FeaturedCarousel
 * Horizontal scrolling carousel for featured/highlighted content
 */
export default function FeaturedCarousel({ theme, items, title }: Props) {
  const handlePress = (item: FeaturedItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    item.onPress();
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: theme.title }]}>
          {title}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
      >
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => handlePress(item)}
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                marginLeft: index === 0 ? 0 : 0,
              },
            ]}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[theme.button + '40', theme.button + '20']}
                style={styles.cardImage}
              >
                <Feather name="star" size={48} color={theme.button} />
              </LinearGradient>
            )}

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.overlay}
            >
              <View style={styles.textContainer}>
                {item.badge && (
                  <View
                    style={[styles.badge, { backgroundColor: theme.button }]}
                  >
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.subtitle}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
