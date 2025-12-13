// // app/(drawer)/(listing)/[id].tsx

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Image,
//   Linking,
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Swiper from 'react-native-swiper';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import * as Haptics from 'expo-haptics';

// import { useFavorites } from '@/components/context/FavoritesContext';
// import { useTheme } from '@/theme/ThemeProvider';
// import { GradientBackground } from '@/theme/GradientBackground';
// import UniversalHeader, { getHeaderHeights } from '@/components/ui/UniversalHeader';
// import HeartButton from '@/components/ui/HeartButton';
// import StaticMap from '@/components/maps/StaticMap';

// import type { Listing } from '@/data/types/listings';
// import { fetchListingById } from '@/data/supabase/listings';


// const SCREEN_PAD = 12;

// export default function ListingDetailsScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const { isFavorite, toggleFavorite } = useFavorites();
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const { headerTotal } = getHeaderHeights(insets.top);
//   const contentPadTop = headerTotal + SCREEN_PAD;

//   const [listing, setListing] = useState<Listing | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     let isMounted = true;

//     async function load() {
//       try {
//         if (!id) return;
//         const data = await fetchListingById(String(id));
//         if (isMounted) setListing(data);
//       } catch (e) {
//         console.error('Error loading listing', e);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       isMounted = false;
//     };
//   }, [id]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4c6cfd" />
//       </View>
//     );
//   }

//   if (!listing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.errorText}>Listing not found</Text>
//       </View>
//     );
//   }

//   // -------------------------------
//   // IMAGES
//   // -------------------------------
//   const galleryImages: string[] = (listing.gallery_image_urls ?? []).filter(
//     (url: string | null): url is string => !!url
//   );

//   const allImages: string[] = [
//     listing.featured_image_url ?? undefined,
//     ...galleryImages,
//   ]
//     .filter((src): src is string => !!src)
//     .slice(0, 10);

//   // -------------------------------
//   // BASIC FIELDS
//   // -------------------------------
//   const description = listing.description ?? '';

//   const category =
//     listing.listing_filter_name ?? listing.listing_filter_slug ?? '';
//   const region = listing.location_name ?? '';
//   const place = listing.location_name ?? '';
//   const city = listing.location_name ?? '';

//   const phone = listing.phone ?? '';
//   const email = listing.email ?? '';
//   const whatsapp = listing.whatsapp ?? phone;
//   const website = listing.website ?? '';
//   const googleMaps = listing.google_map_link ?? '';
//   const youtube = listing.youtube_link ?? '';

//   const facebook = listing.facebook ?? '';
//   const instagram = listing.instagram ?? '';

//   const price = listing.price ?? '';
//   const openHours = listing.working_period ?? '';

//   const isPromoted = !!listing.is_featured;
//   const isPopular = !!listing.is_featured; // later you can change this logic

//   // -------------------------------
//   // COORDINATES / MAP
//   // -------------------------------
//   const hasMap =
//     typeof listing.latitude === 'number' &&
//     typeof listing.longitude === 'number';

//   const hasContactInfo = !!(phone || whatsapp || email);

//   // -------------------------------
//   // CONTACT ACTIONS
//   // -------------------------------
//   const handleCall = () => {
//     if (phone) Linking.openURL(`tel:${phone}`);
//   };

//   const handleWhatsApp = () => {
//     if (whatsapp) {
//       Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, '')}`);
//     }
//   };

//   const handleEmail = () => {
//     if (email) Linking.openURL(`mailto:${email}`);
//   };

//   const handleWebsite = () => {
//     if (website) {
//       const url = website.startsWith('http') ? website : `https://${website}`;
//       Linking.openURL(url);
//     }
//   };

//   const infoItems = [
//     { label: 'Activity', value: category },
//     { label: 'Location', value: listing.location_name },
//     { label: 'Price', value: price },
//     { label: 'Working Period', value: openHours },
//   ].filter((item) => item.value && String(item.value).trim());

//   const handleToggleFavorite = () => {
//     const favoriteItem = {
//       id: listing.id,
//       title: listing.title,
//       description,
//       location: region || city || place,
//     };
//     toggleFavorite(favoriteItem);
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//   };

//   return (
//     <GradientBackground>
//       <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />

//       <UniversalHeader
//         title={listing.title}
//         scrollY={scrollY}
//         left={{ icon: 'arrow-left', autoBack: true }}
//         rightIcons={[
//           {
//             type: 'custom',
//             render: () => (
//               <HeartButton
//                 filled={isFavorite(listing.id)}
//                 colorActive="#FF6B6B"
//                 colorInactive={theme.headerIcon}
//                 size={22}
//                 onToggle={handleToggleFavorite}
//                 hitSlop={8}
//               />
//             ),
//           },
//         ]}
//       />

//       <Animated.ScrollView
//         contentContainerStyle={{
//           paddingTop: contentPadTop,
//           paddingBottom: hasContactInfo ? 80 : 20,
//           paddingHorizontal: SCREEN_PAD,
//         }}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//       >
//         {/* IMAGE GALLERY */}
//         {allImages.length > 0 && (
//           <View style={styles.photos}>
//             <Swiper
//               renderPagination={(index: number, total: number) => (
//                 <View style={styles.photosPagination}>
//                   <Text style={styles.photosPaginationText}>
//                     {index + 1} of {total}
//                   </Text>
//                 </View>
//               )}
//             >
//               {allImages.map((src: string, index: number) => (
//                 <Image key={index} source={{ uri: src }} style={styles.photosImg} />
//               ))}
//             </Swiper>
//           </View>
//         )}

//         {/* TITLE & DESCRIPTION */}
//         <View
//           style={[
//             styles.infoCard,
//             {
//               backgroundColor:
//                 theme.mode === 'dark'
//                   ? 'rgba(255,255,255,0.05)'
//                   : 'rgba(0,0,0,0.02)',
//             },
//           ]}
//         >
//           <Text
//             style={[styles.infoTitle, { color: theme.text }]}
//             numberOfLines={2}
//             ellipsizeMode="tail"
//           >
//             {listing.title}
//           </Text>

//           {(isPromoted || isPopular) && (
//             <View style={styles.badge}>
//               <FeatherIcon
//                 color={theme.button}
//                 name={isPromoted ? 'award' : 'star'}
//                 size={14}
//               />
//               <Text style={[styles.badgeText, { color: theme.button }]}>
//                 {isPromoted ? 'Must Visit' : 'Popular'}
//               </Text>
//             </View>
//           )}

//           {description && (
//             <Text style={[styles.infoDescription, { color: theme.subtitle }]}>
//               {description}
//             </Text>
//           )}
//         </View>

//         {/* INFO GRID */}
//         {infoItems.length > 0 && (
//           <View
//             style={[
//               styles.statsCard,
//               {
//                 backgroundColor:
//                   theme.mode === 'dark'
//                     ? 'rgba(255,255,255,0.05)'
//                     : 'rgba(0,0,0,0.02)',
//               },
//             ]}
//           >
//             {infoItems.map((row, rowIndex) => {
//               if (rowIndex % 2 === 0 && infoItems[rowIndex + 1]) {
//                 return (
//                   <View key={rowIndex} style={styles.statsRow}>
//                     <View style={[styles.statsItem, { borderLeftWidth: 0 }]}>
//                       <Text style={[styles.statsItemText, { color: theme.subtitle }]}>
//                         {String(row.label || '')}
//                       </Text>
//                       <Text style={[styles.statsItemValue, { color: theme.text }]}>
//                         {String(row.value || '')}
//                       </Text>
//                     </View>

//                     <View style={styles.statsItem}>
//                       <Text style={[styles.statsItemText, { color: theme.subtitle }]}>
//                         {String(infoItems[rowIndex + 1].label || '')}
//                       </Text>
//                       <Text style={[styles.statsItemValue, { color: theme.text }]}>
//                         {String(infoItems[rowIndex + 1].value || '')}
//                       </Text>
//                     </View>
//                   </View>
//                 );
//               }
//               return null;
//             })}
//           </View>
//         )}

//         {/* LOCATION MAP */}
//         {hasMap && listing.latitude !== null && listing.longitude !== null && (
//           <>
//             <Text
//               style={{
//                 marginTop: 18,
//                 fontSize: 18,
//                 fontWeight: '700',
//                 color: theme.text,
//               }}
//             >
//               Location
//             </Text>

//             <StaticMap
//               latitude={listing.latitude}
//               longitude={listing.longitude}
//               zoom={15}
//               style={{ height: 160, borderRadius: 16, marginTop: 12 }}
//             />

//             <TouchableOpacity
//               onPress={() => {
//                 const latLng = `${listing.latitude},${listing.longitude}`;
//                 const label = listing.title;
//                 const url = Platform.select({
//                   ios: `maps:0,0?q=${label}@${latLng}`,
//                   android: `geo:0,0?q=${latLng}(${label})`,
//                 });
//                 if (url) Linking.openURL(url);
//               }}
//               style={{
//                 backgroundColor: theme.button,
//                 borderRadius: 12,
//                 padding: 14,
//                 marginTop: 12,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: 8,
//               }}
//             >
//               <FeatherIcon color="#FFFFFF" name="navigation" size={20} />
//               <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
//                 Open Map & Take Me There
//               </Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* OPENING HOURS */}
//         {openHours && (
//           <View
//             style={[
//               styles.infoCard,
//               {
//                 backgroundColor:
//                   theme.mode === 'dark'
//                     ? 'rgba(255,255,255,0.05)'
//                     : 'rgba(0,0,0,0.02)',
//               },
//             ]}
//           >
//             <View style={styles.cardHeader}>
//               <FeatherIcon color={theme.text} name="clock" size={20} />
//               <Text style={[styles.cardHeaderText, { color: theme.text }]}>
//                 Opening Hours
//               </Text>
//             </View>

//             <Text style={[styles.infoDescription, { color: theme.subtitle }]}>
//               {String(openHours)}
//             </Text>
//           </View>
//         )}

//         {/* EXTRA LINKS */}
//         {(website || googleMaps || youtube) && (
//           <View
//             style={[
//               styles.infoCard,
//               {
//                 backgroundColor:
//                   theme.mode === 'dark'
//                     ? 'rgba(255,255,255,0.05)'
//                     : 'rgba(0,0,0,0.02)',
//               },
//             ]}
//           >
//             <View style={styles.cardHeader}>
//               <FeatherIcon color={theme.text} name="info" size={20} />
//               <Text style={[styles.cardHeaderText, { color: theme.text }]}>
//                 Additional Info
//               </Text>
//             </View>

//             {website && (
//               <TouchableOpacity onPress={handleWebsite} style={styles.linkRow}>
//                 <FeatherIcon color="#4c6cfd" name="globe" size={16} />
//                 <Text style={styles.linkText}>Visit Website</Text>
//               </TouchableOpacity>
//             )}

//             {googleMaps && (
//               <TouchableOpacity
//                 onPress={() => Linking.openURL(googleMaps)}
//                 style={styles.linkRow}
//               >
//                 <FeatherIcon color="#4c6cfd" name="map-pin" size={16} />
//                 <Text style={styles.linkText}>Open in Google Maps</Text>
//               </TouchableOpacity>
//             )}

//             {youtube && (
//               <TouchableOpacity
//                 onPress={() => Linking.openURL(youtube)}
//                 style={styles.linkRow}
//               >
//                 <FeatherIcon color="#4c6cfd" name="youtube" size={16} />
//                 <Text style={styles.linkText}>Watch on YouTube</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}

//         {/* SOCIAL MEDIA */}
//         {(facebook || instagram) && (
//           <View
//             style={[
//               styles.infoCard,
//               {
//                 backgroundColor:
//                   theme.mode === 'dark'
//                     ? 'rgba(255,255,255,0.05)'
//                     : 'rgba(0,0,0,0.02)',
//               },
//             ]}
//           >
//             <View style={styles.cardHeader}>
//               <FeatherIcon color={theme.text} name="share-2" size={20} />
//               <Text style={[styles.cardHeaderText, { color: theme.text }]}>
//                 Social Media
//               </Text>
//             </View>

//             {facebook && (
//               <TouchableOpacity
//                 onPress={() => Linking.openURL(facebook)}
//                 style={styles.linkRow}
//               >
//                 <FeatherIcon color="#4267B2" name="facebook" size={16} />
//                 <Text style={styles.linkText}>Follow on Facebook</Text>
//               </TouchableOpacity>
//             )}

//             {instagram && (
//               <TouchableOpacity
//                 onPress={() => Linking.openURL(instagram)}
//                 style={styles.linkRow}
//               >
//                 <FeatherIcon color="#E4405F" name="instagram" size={16} />
//                 <Text style={styles.linkText}>Follow on Instagram</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </Animated.ScrollView>

//       {/* CONTACT BAR */}
//       {hasContactInfo && (
//         <View
//           style={[
//             styles.overlay,
//             {
//               backgroundColor:
//                 theme.mode === 'dark'
//                   ? 'rgba(0,0,0,0.92)'
//                   : 'rgba(255,255,255,0.92)',
//             },
//           ]}
//         >
//           <View style={styles.contactButtons}>
//             {phone && (
//               <TouchableOpacity onPress={handleCall} style={styles.contactBtn}>
//                 <FeatherIcon color={theme.button} name="phone" size={24} />
//                 <Text style={[styles.contactBtnText, { color: theme.subtitle }]}>
//                   Call
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {whatsapp && (
//               <TouchableOpacity
//                 onPress={handleWhatsApp}
//                 style={styles.contactBtn}
//               >
//                 <MaterialCommunityIcons
//                   color={theme.button}
//                   name="whatsapp"
//                   size={26}
//                 />
//                 <Text style={[styles.contactBtnText, { color: theme.subtitle }]}>
//                   WhatsApp
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {email && (
//               <TouchableOpacity onPress={handleEmail} style={styles.contactBtn}>
//                 <FeatherIcon color={theme.button} name="mail" size={24} />
//                 <Text style={[styles.contactBtnText, { color: theme.subtitle }]}>
//                   Email
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}
//     </GradientBackground>
//   );
// }

// /* --------------------------------------------
//  *               STYLES
//  * -------------------------------------------- */
// const styles = StyleSheet.create({
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { fontSize: 18, fontWeight: '600' },

//   photos: {
//     marginTop: 12,
//     position: 'relative',
//     height: 240,
//     overflow: 'hidden',
//     borderRadius: 12,
//   },

//   photosPagination: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#000',
//     borderRadius: 12,
//   },
//   photosPaginationText: { color: '#fff', fontWeight: '600' },

//   photosImg: { width: '100%', height: 240 },

//   infoCard: {
//     marginTop: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },

//   infoTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
//   infoDescription: { fontSize: 15, lineHeight: 22 },

//   badge: {
//     alignSelf: 'flex-start',
//     flexDirection: 'row',
//     backgroundColor: 'rgba(76,108,253,0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   badgeText: { fontWeight: '600', fontSize: 13, marginLeft: 4 },

//   statsCard: { marginTop: 12, borderRadius: 20, overflow: 'hidden' },
//   statsRow: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   statsItem: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     borderLeftWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   statsItemText: { fontSize: 13, color: '#aaa' },
//   statsItemValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },

//   cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   cardHeaderText: { fontSize: 18, marginLeft: 8, fontWeight: '600' },

//   linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
//   linkText: { marginLeft: 8, fontSize: 15, fontWeight: '500' },

//   hoursRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//   },
//   hoursDay: { fontSize: 15 },
//   hoursTime: { fontSize: 15, fontWeight: '600' },

//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 66,
//     borderTopWidth: 0.5,
//     paddingHorizontal: 16,
//     paddingBottom: 6,
//     paddingTop: 8,
//     backgroundColor: '#fff',
//   },
//   contactButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: '100%',
//   },
//   contactBtn: { alignItems: 'center' },
//   contactBtnText: { marginTop: 4, fontSize: 12 },
// });




import React from 'react'
import { Text, View } from 'react-native'

const ListingDetail = () => {
  return (
    <View>
      <Text>[id]</Text>
    </View>
  )
}

export default ListingDetail