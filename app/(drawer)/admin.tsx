// // Admin Hub - System Statistics & Management
// import UniversalHeader, { getHeaderHeights } from '@/components/ui/UniversalHeader';
// import { useAvailableActivities, useAvailableLocations, useExperiences } from '@/database/useListings';
// import { useTheme } from '@/theme';
// import { GradientBackground } from '@/theme/GradientBackground';
// import { Feather } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const SCREEN_PAD = 12;

// interface SystemStats {
//   totalListings: number;
//   promotedListings: number; // Not used - kept for UI compatibility
//   popularListings: number; // Not used - kept for UI compatibility
//   categoriesCount: number; // Activities count
//   placesCount: number; // Locations count
//   lastSyncDate: string;
//   imagesInStorage: number;
//   databaseSize: string;
//   avgLoadTime: number;
// }

// export default function AdminHub() {
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const { headerTotal } = getHeaderHeights(insets.top);
//   const contentPadTop = headerTotal + SCREEN_PAD;

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState<SystemStats>({
//     totalListings: 0,
//     promotedListings: 0,
//     popularListings: 0,
//     categoriesCount: 0,
//     placesCount: 0,
//     lastSyncDate: 'N/A',
//     imagesInStorage: 75,
//     databaseSize: 'N/A',
//     avgLoadTime: 0,
//   });

//   useEffect(() => {
//     loadStats();
//   }, []);

//   // Use hooks to fetch data
//   const { data: allExperiences = [] } = useExperiences();
//   const { data: activities = [] } = useAvailableActivities();
//   const { data: locations = [] } = useAvailableLocations();

//   const loadStats = async () => {
//     try {
//       setLoading(true);
//       const startTime = Date.now();
      
//       const loadTime = Date.now() - startTime;

//       // Get last sync date from newest experience
//       const lastSync = allExperiences.length > 0 && allExperiences[0].updatedAt
//         ? new Date(allExperiences[0].updatedAt).toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })
//         : 'N/A';

//       // Count images
//       const totalImages = allExperiences.reduce((sum, exp) => sum + (exp.imageUrls?.length || 0), 0);

//       setStats({
//         totalListings: allExperiences.length,
//         promotedListings: 0, // Not used in new dcgapp.com data
//         popularListings: 0, // Not used in new dcgapp.com data
//         categoriesCount: activities.length,
//         placesCount: locations.length,
//         lastSyncDate: lastSync,
//         imagesInStorage: totalImages,
//         databaseSize: `${(allExperiences.length * 3.5).toFixed(1)} KB`, // Estimate
//         avgLoadTime: loadTime,
//       });
//     } catch (error) {
//       console.error('Error loading admin stats:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadStats();
//   };

//   const StatCard = ({ 
//     icon, 
//     title, 
//     value, 
//     subtitle, 
//     color 
//   }: { 
//     icon: string; 
//     title: string; 
//     value: string | number; 
//     subtitle?: string;
//     color?: string;
//   }) => (
//     <View style={[
//       styles.statCard, 
//       { 
//         backgroundColor: theme.mode === 'dark' 
//           ? 'rgba(255,255,255,0.05)' 
//           : 'rgba(0,0,0,0.02)',
//         borderColor: theme.mode === 'dark' 
//           ? 'rgba(255,255,255,0.1)' 
//           : 'rgba(0,0,0,0.08)',
//       }
//     ]}>
//       <View style={[styles.statIconContainer, { backgroundColor: color || theme.button + '20' }]}>
//         <Feather name={icon as any} size={24} color={color || theme.button} />
//       </View>
//       <View style={styles.statContent}>
//         <Text style={[styles.statTitle, { color: theme.subtitle }]}>{title}</Text>
//         <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
//         {subtitle && (
//           <Text style={[styles.statSubtitle, { color: theme.subtitle }]}>{subtitle}</Text>
//         )}
//       </View>
//     </View>
//   );

//   const ActionButton = ({ 
//     icon, 
//     title, 
//     onPress 
//   }: { 
//     icon: string; 
//     title: string; 
//     onPress: () => void;
//   }) => (
//     <TouchableOpacity
//       style={[
//         styles.actionButton,
//         {
//           backgroundColor: theme.mode === 'dark'
//             ? 'rgba(255,255,255,0.08)'
//             : 'rgba(0,0,0,0.04)',
//           borderColor: theme.mode === 'dark'
//             ? 'rgba(255,255,255,0.1)'
//             : 'rgba(0,0,0,0.08)',
//         }
//       ]}
//       onPress={() => {
//         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//         onPress();
//       }}
//     >
//       <Feather name={icon as any} size={20} color={theme.text} />
//       <Text style={[styles.actionButtonText, { color: theme.text }]}>{title}</Text>
//       <Feather name="chevron-right" size={18} color={theme.subtitle} />
//     </TouchableOpacity>
//   );

//   return (
//     <GradientBackground>
//       <UniversalHeader
//         title="Admin Hub"
//         scrollY={scrollY}
//         left={{ icon: 'arrow-left', autoBack: true }}
//         rightIcons={[
//           { 
//             type: 'icon', 
//             icon: 'refresh-cw', 
//             onPress: onRefresh 
//           },
//         ]}
//       />

//       <Animated.ScrollView
//         contentContainerStyle={{
//           paddingTop: contentPadTop,
//           paddingBottom: 24,
//           paddingHorizontal: SCREEN_PAD,
//         }}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* System Overview */}
//         <View style={styles.section}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>
//             System Overview
//           </Text>
          
//           <StatCard
//             icon="database"
//             title="Total Listings"
//             value={stats.totalListings}
//             subtitle={`${stats.promotedListings} promoted, ${stats.popularListings} popular`}
//             color="#4c6cfd"
//           />

//           <View style={styles.statsRow}>
//             <View style={{ flex: 1, marginRight: 6 }}>
//               <StatCard
//                 icon="tag"
//                 title="Categories"
//                 value={stats.categoriesCount}
//                 color="#FF6B6B"
//               />
//             </View>
//             <View style={{ flex: 1, marginLeft: 6 }}>
//               <StatCard
//                 icon="map-pin"
//                 title="Locations"
//                 value={stats.placesCount}
//                 color="#00D9FF"
//               />
//             </View>
//           </View>
//         </View>

//         {/* Storage & Performance */}
//         <View style={styles.section}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>
//             Storage & Performance
//           </Text>

//           <StatCard
//             icon="image"
//             title="Cached Images"
//             value={stats.imagesInStorage}
//             subtitle="Featured images in Appwrite"
//             color="#FFB800"
//           />

//           <View style={styles.statsRow}>
//             <View style={{ flex: 1, marginRight: 6 }}>
//               <StatCard
//                 icon="hard-drive"
//                 title="Database Size"
//                 value={stats.databaseSize}
//                 color="#9B59B6"
//               />
//             </View>
//             <View style={{ flex: 1, marginLeft: 6 }}>
//               <StatCard
//                 icon="zap"
//                 title="Load Time"
//                 value={`${stats.avgLoadTime}ms`}
//                 color="#2ECC71"
//               />
//             </View>
//           </View>
//         </View>

//         {/* Sync Information */}
//         <View style={styles.section}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>
//             Synchronization
//           </Text>

//           <View style={[
//             styles.syncCard,
//             {
//               backgroundColor: theme.mode === 'dark'
//                 ? 'rgba(255,255,255,0.05)'
//                 : 'rgba(0,0,0,0.02)',
//               borderColor: theme.mode === 'dark'
//                 ? 'rgba(255,255,255,0.1)'
//                 : 'rgba(0,0,0,0.08)',
//             }
//           ]}>
//             <View style={styles.syncRow}>
//               <Feather name="refresh-cw" size={18} color={theme.subtitle} />
//               <Text style={[styles.syncLabel, { color: theme.subtitle }]}>
//                 Last Sync
//               </Text>
//             </View>
//             <Text style={[styles.syncValue, { color: theme.text }]}>
//               {stats.lastSyncDate}
//             </Text>
//           </View>
//         </View>

//         {/* Admin Actions */}
//         <View style={styles.section}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>
//             Quick Actions
//           </Text>

//           <ActionButton
//             icon="refresh-cw"
//             title="Trigger WordPress Sync"
//             onPress={() => {
//               console.log('Sync triggered');
//               // TODO: Implement sync trigger
//             }}
//           />

//           <ActionButton
//             icon="image"
//             title="Manage Image Cache"
//             onPress={() => {
//               console.log('Image cache management');
//               // TODO: Navigate to image management
//             }}
//           />

//           <ActionButton
//             icon="shield"
//             title="Security Settings"
//             onPress={() => {
//               console.log('Security settings');
//               // TODO: Navigate to security
//             }}
//           />

//           <ActionButton
//             icon="settings"
//             title="System Configuration"
//             onPress={() => {
//               console.log('System config');
//               // TODO: Navigate to config
//             }}
//           />
//         </View>

//         {/* System Info */}
//         <View style={[
//           styles.infoBox,
//           {
//             backgroundColor: theme.mode === 'dark'
//               ? 'rgba(76,108,253,0.1)'
//               : 'rgba(76,108,253,0.08)',
//             borderColor: 'rgba(76,108,253,0.3)',
//           }
//         ]}>
//           <Feather name="info" size={16} color="#4c6cfd" />
//           <Text style={[styles.infoText, { color: theme.text }]}>
//             Admin access only. These statistics are updated in real-time when you refresh.
//           </Text>
//         </View>
//       </Animated.ScrollView>
//     </GradientBackground>
//   );
// }

// const styles = StyleSheet.create({
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 12,
//   },
//   statCard: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   statIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   statContent: {
//     flex: 1,
//   },
//   statTitle: {
//     fontSize: 12,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   statSubtitle: {
//     fontSize: 11,
//     marginTop: 2,
//   },
//   statsRow: {
//     flexDirection: 'row',
//   },
//   syncCard: {
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   syncRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   syncLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   syncValue: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginBottom: 8,
//     gap: 12,
//   },
//   actionButtonText: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   infoBox: {
//     flexDirection: 'row',
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     gap: 10,
//     marginTop: 8,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     lineHeight: 18,
//   },
// });


import React from 'react'
import { Text, View } from 'react-native'

const admin = () => {
  return (
    <View>
      <Text>admin</Text>
    </View>
  )
}

export default admin
