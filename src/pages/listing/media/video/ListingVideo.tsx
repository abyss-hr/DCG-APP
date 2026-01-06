// File: src/pages/listing/media/video/ListingVideo.tsx
// YouTube video embed using react-native-youtube-iframe

import React from 'react';
import { StyleSheet, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Card } from '@/components/ui/Card';
import type { VideoProps } from '../../types';

export default function ListingVideo({ youtubeUrl }: VideoProps) {
  if (!youtubeUrl) return null;

  // Extract video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;

  return (
    <Card>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={220}
          play={false}
          videoId={videoId}
          webViewProps={{
            androidLayerType: 'hardware',
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
