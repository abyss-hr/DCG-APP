import { Listing } from "@/database/Listing";
import { fetchListings } from "@/database/listingService";
import { GradientBackground } from "@/theme/GradientBackground";
import { useTheme } from "@/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function ListingsScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetchListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <GradientBackground>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: theme.cardBackground,
              padding: 12,
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <Image
              source={{ uri: item.featuredImageUrl }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 14,
                marginBottom: 10,
              }}
            />
            <Text style={{ color: theme.title, fontSize: 18, fontWeight: "600" }}>
              {item.title}
            </Text>
            <Text style={{ color: theme.subtitle }}>
              {item.categoryName} • {item.locationMain}
            </Text>
          </View>
        )}
      />
    </GradientBackground>
  );
}
