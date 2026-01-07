// src/components/modals/settings/SettingsModal.tsx
// Bottom sheet Settings modal using modular subcomponents

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  Text,
  TextInput,
  Easing,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Theme system
import { useTheme, typography } from "@/theme";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";

// Contexts
import { useOffline } from "@/components/context/OfflineContext";
import { useLocation } from "@/components/context/LocationContext";
import { useZoom } from "@/components/context/ZoomContext";

// Modular settings components (barrel export)
import {
  SectionHeader,
  SettingToggle,
  SettingButton,
  ThemeSelector,
  ZoomSelector,
  StatusBanner,
} from "@/components/modals/settings";

import type { ZoomMode } from "@/components/modals/settings/ZoomSelector";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

type ThemeMode = "system" | "light" | "dark";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { theme, mode, setMode } = useTheme();

  const {
    offlineEnabled,
    enableOfflineMode,
    disableOfflineMode,
    clearCache: clearOfflineCache,
    cachedListingsCount,
    isOnline,
    cacheSize,
    refreshCacheSize,
  } = useOffline();

  const {
    locationEnabled,
    permissionStatus,
    userLocation,
    enableLocation,
    disableLocation,
  } = useLocation();

  const { zoomMode, setZoomMode } = useZoom();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAboutSection, setShowAboutSection] = useState(false);
  const [expandedAboutItem, setExpandedAboutItem] = useState<
    "version" | "terms" | "privacy" | "help" | null
  >(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // Load cache info on mount
  useEffect(() => {
    refreshCacheSize();
  }, []);

  // 🟣 OPEN — smooth iOS slide-up (NO bounce)
  const openAnim = () => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔵 CLOSE — smooth slide-down
  const closeAnim = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => cb?.());
  };

  useEffect(() => {
    if (visible) openAnim();
  }, [visible]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    closeAnim(onClose);
  };

  const handleThemeChange = async (newMode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await setMode(newMode);
  };

  const handleZoomChange = async (newZoom: ZoomMode) => {
    await setZoomMode(newZoom);
  };

  const handleClearCache = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    if (cachedListingsCount === 0 && cacheSize === "0 B") {
      Alert.alert("No Cache", "There is no cached data to clear.");
      return;
    }

    Alert.alert(
      "Clear Cache",
      `This will clear ${cachedListingsCount} cached listings and ${cacheSize} of data. The app will re-download content on next use.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearOfflineCache();
              await refreshCacheSize();
              Alert.alert("Success", "Cache cleared successfully");
            } catch {
              Alert.alert("Error", "Failed to clear cache");
            }
          },
        },
      ]
    );
  };

  const handleOpenDeviceSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Linking.openSettings().catch(() => {
      Alert.alert("Error", "Unable to open device settings.");
    });
  };

  const toggleAboutSection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowAboutSection(!showAboutSection);
    if (showAboutSection) {
      setExpandedAboutItem(null); // Reset expanded items when closing
    }
  };

  const toggleAboutItem = (item: "version" | "terms" | "privacy" | "help") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpandedAboutItem(expandedAboutItem === item ? null : item);
  };

  const handleAdminPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setShowAdminPrompt(true);
  };

  const handleAdminLogin = () => {
    const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      Alert.alert(
        "Admin Disabled",
        "Admin access is not configured for this build."
      );
      setAdminPassword("");
      setShowAdminPrompt(false);
      return;
    }

    if (adminPassword === ADMIN_PASSWORD) {
      setShowAdminPrompt(false);
      setAdminPassword("");
      handleClose();
      setTimeout(() => {
        router.push("/admin");
      }, 300);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert("Access Denied", "Incorrect password");
      setAdminPassword("");
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalWrapper}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.backdrop, { opacity: fade }]} />
        </TouchableWithoutFeedback>

        {/* Bottom sheet */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.background,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text
              style={{
                color: theme.title,
                fontSize: 20,
                fontWeight: "700",
              }}
            >
              Settings
            </Text>

            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* APPEARANCE */}
            <SectionHeader title="APPEARANCE" />
            <View style={styles.section}>
              <ThemeSelector mode={mode as ThemeMode} onChange={handleThemeChange} />
            </View>

            {/* DISPLAY */}
            <SectionHeader title="DISPLAY" />
            <View style={styles.section}>
              <ZoomSelector zoomMode={zoomMode} onChange={handleZoomChange} />
            </View>

            {/* PRIVACY & PERMISSIONS */}
            <SectionHeader title="PRIVACY & PERMISSIONS" />
            <View style={styles.section}>
              <SettingToggle
                icon="map-pin"
                title="Location Services"
                description={
                  permissionStatus === "granted" && userLocation
                    ? `Location enabled • ${userLocation.latitude.toFixed(
                        4
                      )}, ${userLocation.longitude.toFixed(4)}`
                    : permissionStatus === "blocked"
                    ? "Permission blocked - Open Settings to enable"
                    : permissionStatus === "denied"
                    ? "Permission denied - Toggle to request again"
                    : "Enable to see nearby listings and distances"
                }
                value={locationEnabled}
                onValueChange={(value) => {
                  if (value) enableLocation();
                  else disableLocation();
                }}
                color="#4CAF50"
              />

              {/* Location error UI */}
              {permissionStatus !== "granted" && (
                <View
                  style={{
                    marginTop: spacing.sm,
                    marginBottom: spacing.sm,
                  }}
                >
                  {permissionStatus === "blocked" ? (
                    <>
                      <Text
                        style={{
                          color: "#FF6B6B",
                          marginBottom: spacing.xs,
                          fontWeight: "600",
                        }}
                      >
                        Location permission is blocked.
                      </Text>

                      <SettingButton
                        icon="settings"
                        title="Open Device Settings"
                        description="Enable permission in system settings"
                        onPress={handleOpenDeviceSettings}
                        color="#FF6B6B"
                      />
                    </>
                  ) : permissionStatus === "denied" ? (
                    <>
                      <Text
                        style={{
                          color: "#FF9800",
                          marginBottom: spacing.xs,
                          fontWeight: "600",
                        }}
                      >
                        Permission denied. You can retry.
                      </Text>

                      <SettingButton
                        icon="refresh-cw"
                        title="Retry Location Request"
                        description="Try requesting permission again."
                        onPress={enableLocation}
                        color="#FF9800"
                      />
                    </>
                  ) : null}
                </View>
              )}

              {/* Notifications */}
              <SettingToggle
                icon="bell"
                title="Notifications"
                description="Get updates about new listings and promotions"
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color="#FF9800"
              />
            </View>

            {/* DATA */}
            <SectionHeader title="DATA & STORAGE" />
            <View style={styles.section}>
              <SettingToggle
                icon="wifi-off"
                title="Offline Mode"
                description={
                  offlineEnabled && cachedListingsCount > 0
                    ? `${cachedListingsCount} listings cached • ${
                        isOnline ? "Online" : "Offline"
                      }`
                    : "Cache listings for offline access"
                }
                value={offlineEnabled}
                onValueChange={(value) =>
                  value ? enableOfflineMode() : disableOfflineMode()
                }
                color="#9C27B0"
              />

              <SettingButton
                icon="trash-2"
                title="Clear Cache"
                description={
                  cachedListingsCount > 0 || cacheSize !== "0 B"
                    ? `${cachedListingsCount} listings • ${cacheSize} used`
                    : "No cached data"
                }
                onPress={handleClearCache}
                color="#F44336"
                rightText={cacheSize}
              />
            </View>

            {/* STATUS */}
            <StatusBanner isOnline={isOnline} />

            {/* ABOUT & ADMIN BUTTONS */}
            <View style={styles.ghostButtonsRow}>
              {/* About Button */}
              <TouchableOpacity
                onPress={toggleAboutSection}
                style={[
                  styles.ghostButton,
                  {
                    borderColor:
                      theme.mode === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.15)",
                  },
                ]}
                activeOpacity={0.7}
              >
                <Feather name="info" size={20} color={theme.button} />
                <Text style={[styles.ghostButtonText, { color: theme.button }]}>
                  About
                </Text>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={theme.button}
                />
              </TouchableOpacity>

              {/* Admin Hub Button */}
              <TouchableOpacity
                onPress={handleAdminPress}
                style={[
                  styles.ghostButton,
                  {
                    borderColor: "rgba(255,107,107,0.3)",
                  },
                ]}
                activeOpacity={0.7}
              >
                <Feather name="shield" size={20} color="#FF6B6B" />
                <Text style={[styles.ghostButtonText, { color: "#FF6B6B" }]}>
                  Admin Hub
                </Text>
                <Feather name="chevron-right" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>

            {/* ABOUT ITEMS - Expandable */}
            {showAboutSection && (
              <View style={styles.aboutItemsContainer}>
                {/* 
                  ========================================
                  📝 ABOUT SECTION - EDITABLE CONTENT
                  ========================================
                  Edit the text content and links below
                */}

                {/* App Version */}
                <View style={styles.aboutItem}>
                  <TouchableOpacity
                    onPress={() => toggleAboutItem("version")}
                    style={[
                      styles.aboutItemHeader,
                      {
                        backgroundColor:
                          theme.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.aboutItemLeft}>
                      <Feather name="package" size={18} color={theme.button} />
                      <Text style={[styles.aboutItemTitle, { color: theme.text }]}>
                        App Version
                      </Text>
                    </View>
                    <View style={styles.aboutItemRight}>
                      <Text style={[styles.aboutItemVersion, { color: theme.subtitle }]}>
                        1.0.0 {/* 👈 EDIT VERSION HERE */}
                      </Text>
                      <Feather
                        name={
                          expandedAboutItem === "version"
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={16}
                        color={theme.subtitle}
                      />
                    </View>
                  </TouchableOpacity>
                  {expandedAboutItem === "version" && (
                    <View style={[styles.aboutItemContent, { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)" }]}>
                      <Text style={[styles.aboutItemText, { color: theme.subtitle }]}>
                        {/* 👇 EDIT APP DESCRIPTION HERE */}
                        DCG - Dubrovnik City Guide is your ultimate companion for exploring 
                        Dubrovnik and the Elaphiti Islands. Discover hidden gems, popular 
                        attractions, beaches, restaurants, and more.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Terms & Conditions */}
                <View style={styles.aboutItem}>
                  <TouchableOpacity
                    onPress={() => toggleAboutItem("terms")}
                    style={[
                      styles.aboutItemHeader,
                      {
                        backgroundColor:
                          theme.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.aboutItemLeft}>
                      <Feather name="file-text" size={18} color={theme.button} />
                      <Text style={[styles.aboutItemTitle, { color: theme.text }]}>
                        Terms & Conditions
                      </Text>
                    </View>
                    <Feather
                      name={
                        expandedAboutItem === "terms"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color={theme.subtitle}
                    />
                  </TouchableOpacity>
                  {expandedAboutItem === "terms" && (
                    <View style={[styles.aboutItemContent, { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)" }]}>
                      <Text style={[styles.aboutItemText, { color: theme.subtitle }]}>
                        {/* 👇 EDIT TERMS TEXT OR ADD LINK BUTTON HERE */}
                        By using this app, you agree to our terms of service. 
                        We strive to provide accurate and up-to-date information about 
                        locations in Dubrovnik.
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          // 👈 ADD YOUR TERMS URL HERE
                          // Linking.openURL('https://yourwebsite.com/terms');
                          Alert.alert("Terms & Conditions", "Full terms will be available online.");
                        }}
                        style={styles.linkButton}
                      >
                        <Text style={[styles.linkButtonText, { color: theme.button }]}>
                          Read Full Terms →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Privacy Policy */}
                <View style={styles.aboutItem}>
                  <TouchableOpacity
                    onPress={() => toggleAboutItem("privacy")}
                    style={[
                      styles.aboutItemHeader,
                      {
                        backgroundColor:
                          theme.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.aboutItemLeft}>
                      <Feather name="shield" size={18} color={theme.button} />
                      <Text style={[styles.aboutItemTitle, { color: theme.text }]}>
                        Privacy Policy
                      </Text>
                    </View>
                    <Feather
                      name={
                        expandedAboutItem === "privacy"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color={theme.subtitle}
                    />
                  </TouchableOpacity>
                  {expandedAboutItem === "privacy" && (
                    <View style={[styles.aboutItemContent, { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)" }]}>
                      <Text style={[styles.aboutItemText, { color: theme.subtitle }]}>
                        {/* 👇 EDIT PRIVACY TEXT HERE */}
                        We respect your privacy. Location data is only used for showing 
                        nearby listings and calculating distances. No personal data is 
                        shared with third parties.
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          // 👈 ADD YOUR PRIVACY URL HERE
                          // Linking.openURL('https://yourwebsite.com/privacy');
                          Alert.alert("Privacy Policy", "Full privacy policy will be available online.");
                        }}
                        style={styles.linkButton}
                      >
                        <Text style={[styles.linkButtonText, { color: theme.button }]}>
                          Read Full Policy →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Help & Support */}
                <View style={styles.aboutItem}>
                  <TouchableOpacity
                    onPress={() => toggleAboutItem("help")}
                    style={[
                      styles.aboutItemHeader,
                      {
                        backgroundColor:
                          theme.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.aboutItemLeft}>
                      <Feather name="help-circle" size={18} color={theme.button} />
                      <Text style={[styles.aboutItemTitle, { color: theme.text }]}>
                        Help & Support
                      </Text>
                    </View>
                    <Feather
                      name={
                        expandedAboutItem === "help"
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color={theme.subtitle}
                    />
                  </TouchableOpacity>
                  {expandedAboutItem === "help" && (
                    <View style={[styles.aboutItemContent, { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)" }]}>
                      <Text style={[styles.aboutItemText, { color: theme.subtitle }]}>
                        {/* 👇 EDIT SUPPORT TEXT HERE */}
                        Need help? Have questions or feedback? We're here to help!
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          // 👈 ADD YOUR SUPPORT EMAIL HERE
                          // Linking.openURL('mailto:support@dcgapp.com');
                          Alert.alert("Contact Support", "Email: support@dcgapp.com\n\nWe'll respond within 24 hours!");
                        }}
                        style={styles.linkButton}
                      >
                        <Text style={[styles.linkButtonText, { color: theme.button }]}>
                          Contact Support →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* MADE WITH LOVE - Always visible */}
            <View style={styles.footerLove}>
              <Text style={[styles.loveText, { color: theme.subtitle }]}>
                Made with ❤️ in Dubrovnik
              </Text>
              <Text style={[styles.copyrightText, { color: theme.subtitle }]}>
                © 2025 DCG App {/* 👈 EDIT YEAR HERE */}
              </Text>
            </View>

            {/* Bottom spacing */}
            <View style={{ height: spacing.xl }} />
          </ScrollView>
        </Animated.View>
      </View>

      {/* ADMIN PASSWORD PROMPT */}
      {showAdminPrompt && (
        <Modal visible={showAdminPrompt} transparent animationType="fade">
          <View style={styles.adminPromptOverlay}>
            <TouchableWithoutFeedback onPress={() => {
              setShowAdminPrompt(false);
              setAdminPassword("");
            }}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            
            <View style={[styles.adminPromptBox, { backgroundColor: theme.background }]}>
              <View style={[styles.adminPromptHeader, { borderBottomColor: theme.border }]}>
                <Feather name="shield" size={24} color="#FF6B6B" />
                <Text style={[styles.adminPromptTitle, { color: theme.title }]}>
                  Admin Access
                </Text>
              </View>

              <Text style={[styles.adminPromptText, { color: theme.subtitle }]}>
                Enter admin password to continue
              </Text>

              <TextInput
                style={[
                  styles.adminPasswordInput,
                  {
                    backgroundColor:
                      theme.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                    borderColor:
                      theme.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                    color: theme.text,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={theme.subtitle}
                secureTextEntry
                value={adminPassword}
                onChangeText={setAdminPassword}
                autoFocus
                onSubmitEditing={handleAdminLogin}
              />

              <View style={styles.adminPromptButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setShowAdminPrompt(false);
                    setAdminPassword("");
                  }}
                  style={[
                    styles.adminPromptButton,
                    {
                      backgroundColor:
                        theme.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                    },
                  ]}
                >
                  <Text style={[styles.adminPromptButtonText, { color: theme.subtitle }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAdminLogin}
                  style={[
                    styles.adminPromptButton,
                    { backgroundColor: "#FF6B6B" },
                  ]}
                >
                  <Text style={[styles.adminPromptButtonText, { color: "#FFF" }]}>
                    Enter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: MODAL_HEIGHT,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  ghostButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  ghostButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  ghostButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  aboutItemsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  aboutItem: {
    borderRadius: radii.md,
    overflow: "hidden",
  },
  aboutItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  aboutItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  aboutItemTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  aboutItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  aboutItemVersion: {
    fontSize: 13,
    fontWeight: "500",
  },
  aboutItemContent: {
    padding: spacing.md,
    paddingTop: 0,
    gap: spacing.sm,
  },
  aboutItemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  linkButton: {
    marginTop: spacing.xs,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerLove: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  loveText: {
    fontSize: 14,
    fontWeight: "500",
  },
  copyrightText: {
    fontSize: 12,
  },
  adminPromptOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: spacing.lg,
  },
  adminPromptBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: radii.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  adminPromptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  adminPromptTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  adminPromptText: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  adminPasswordInput: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  adminPromptButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  adminPromptButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
  },
  adminPromptButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
