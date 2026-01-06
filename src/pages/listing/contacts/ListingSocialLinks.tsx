// File: src/pages/listing/contacts/ListingSocialLinks.tsx
// Social media and website links

import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Globe, Facebook, Instagram } from 'lucide-react-native';
import { useTheme, typography } from '@/theme';
import { Card } from '@/components/ui/Card';
import TouchableHaptic from '@/components/ui/TouchableHaptic';
import type { SocialLinksProps } from '../types';

export default function ListingSocialLinks({
  website,
  facebook,
  instagram,
}: SocialLinksProps) {
  const { theme } = useTheme();

  if (!website && !facebook && !instagram) return null;

  const openWebsite = () => {
    if (!website) return;
    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const openFacebook = () => {
    if (!facebook) return;
    const url = facebook.startsWith('http')
      ? facebook
      : `https://facebook.com/${facebook}`;
    Linking.openURL(url);
  };

  const openInstagram = () => {
    if (!instagram) return;
    const url = instagram.startsWith('http')
      ? instagram
      : `https://instagram.com/${instagram}`;
    Linking.openURL(url);
  };

  return (
    <Card>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Links</Text>

        <View style={styles.linksContainer}>
        {website && (
          <TouchableHaptic
            style={[styles.linkButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={openWebsite}
            haptic="light"
          >
            <Globe size={20} color={theme.button} />
            <Text style={[styles.linkText, { color: theme.text }]} numberOfLines={1}>
              Website
            </Text>
          </TouchableHaptic>
        )}

        {facebook && (
          <TouchableHaptic
            style={[styles.linkButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={openFacebook}
            haptic="light"
          >
            <Facebook size={20} color="#1877F2" />
            <Text style={[styles.linkText, { color: theme.text }]} numberOfLines={1}>
              Facebook
            </Text>
          </TouchableHaptic>
        )}

        {instagram && (
          <TouchableHaptic
            style={[styles.linkButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={openInstagram}
            haptic="light"
          >
            <Instagram size={20} color="#E4405F" />
            <Text style={[styles.linkText, { color: theme.text }]} numberOfLines={1}>
              Instagram
            </Text>
          </TouchableHaptic>
        )}
      </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
  },
  linkText: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
});
