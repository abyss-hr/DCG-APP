// components/ui/TouchableHaptic.tsx
import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

type Props = PressableProps & { haptic?: 'none' | 'light' | 'medium' | 'heavy' | 'selection' };

export default function TouchableHaptic({
  haptic = 'selection',
  onPress,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const handlePress: PressableProps['onPress'] = (e) => {
    if (haptic === 'selection') Haptics.selectionAsync();
    else if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (haptic === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (haptic === 'heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress?.(e);
  };
  return <Pressable onPress={handlePress} {...rest}>{children}</Pressable>;
}