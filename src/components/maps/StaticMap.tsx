import React, { useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageStyle,
  StyleProp,
  Platform,
  Linking,
  View,
  Text,
} from "react-native";
import Constants from "expo-constants";
import { useTheme } from "@/theme";

type Props = {
  latitude: number;
  longitude: number;
  zoom?: number;
  style?: StyleProp<ImageStyle>;
  clickable?: boolean;
};

export default function StaticMap({
  latitude,
  longitude,
  zoom = 15,
  style,
  clickable = false,
}: Props) {
  const { theme } = useTheme();
  const [failed, setFailed] = useState(false);

  // Get API key from expo config extra (set by app.config.js)
  const apiKey = Constants.expoConfig?.extra?.googleStaticMapsKey;

  // Debug logging
  React.useEffect(() => {
    if (!apiKey) {
      console.warn('StaticMap: No Google Static Maps API key found in Constants.expoConfig.extra.googleStaticMapsKey');
    } else {
      console.log('StaticMap: API key loaded successfully');
    }
  }, [apiKey]);

  const mapStyle =
    theme.mode === "dark"
      ? "feature:all|element:labels|visibility:off&style=feature:poi|visibility:off&style=feature:road|element:geometry|color:0x2b2b2b&style=feature:water|color:0x0f1a24"
      : "";

  const url = useMemo(() => {
    if (!apiKey) {
      console.warn('StaticMap: Cannot generate URL - API key missing');
      return undefined;
    }

    const finalUrl = 
      "https://maps.googleapis.com/maps/api/staticmap" +
      `?center=${latitude},${longitude}` +
      `&zoom=${zoom}` +
      `&size=640x400` +
      `&scale=2` +
      `&markers=color:red|${latitude},${longitude}` +
      (mapStyle ? `&style=${mapStyle}` : "") +
      `&key=${apiKey}`;

    console.log('StaticMap URL:', finalUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    return finalUrl;
  }, [latitude, longitude, zoom, apiKey, mapStyle]);

  const handlePress = () => {
    if (!clickable) return;

    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
    });

    if (mapUrl) Linking.openURL(mapUrl);
  };

  if (!url || failed) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={{ color: theme.subtitle, fontSize: 14 }}>
          {!apiKey ? '🗺️ Map unavailable (API key missing)' : '🗺️ Map unavailable'}
        </Text>
        {!apiKey && (
          <Text style={{ color: theme.subtitle, fontSize: 11, marginTop: 4, textAlign: 'center', paddingHorizontal: 16 }}>
            Add GOOGLE_STATIC_MAPS_KEY to .env file
          </Text>
        )}
      </View>
    );
  }

  const image = (
    <Image
      source={{ uri: url }}
      style={[styles.map, style]}
      resizeMode="cover"
      onError={(error) => {
        console.error('StaticMap: Failed to load image', error.nativeEvent.error);
        setFailed(true);
      }}
    />
  );

  if (!clickable) return image;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      {image}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: "#E2E2E2",
  },
  fallback: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
  },
});
