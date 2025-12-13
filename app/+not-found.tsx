// app/+not-found.tsx
'use client';

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Text style={styles.body}>
          The page you’re looking for may have been moved or deleted.
        </Text>

        <Link href="/" asChild>
          <Pressable style={styles.button} accessibilityRole="button" accessibilityLabel="Go to home">
            <Text style={styles.buttonText}>Go to home screen</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8, color: '#111' },
  body: { fontSize: 14, color: '#333', marginBottom: 16, textAlign: 'center' },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9' },
  buttonText: { fontSize: 14, fontWeight: '700', color: '#111' },
});