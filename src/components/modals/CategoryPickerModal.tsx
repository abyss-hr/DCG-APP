// components/modals/CategoryPickerModal.tsx
import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TouchableHaptic from '@/components/ui/TouchableHaptic';

type Props = {
  visible: boolean;
  theme: any;
  categories: string[];
  selected: string | 'All';
  onSelect: (val: string | 'All') => void;
  onClose: () => void;
  title?: string;
};

export default function CategoryPickerModal({
  visible,
  theme,
  categories,
  selected,
  onSelect,
  onClose,
  title = 'Filter favorites',
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
          <View style={styles.modalHeader}>
            <Text style={{ color: theme.title, fontSize: 14, fontWeight: '400' }}>
              {title}
            </Text>
            <TouchableHaptic onPress={onClose} accessibilityLabel="Close">
              <Feather name="x" size={20} color={theme.subtitle} />
            </TouchableHaptic>
          </View>

          {categories.map((cat) => {
            const isSel = selected === cat;
            return (
              <TouchableHaptic 
                key={cat} 
                onPress={() => { 
                  // Single-select behavior: always select the clicked category
                  onSelect(cat); 
                  onClose(); 
                }} 
                style={styles.optionRow}
              >
                <View style={styles.optionLeft}>
                  <Feather 
                    name={isSel ? 'check-circle' : 'circle'} 
                    size={18} 
                    color={isSel ? theme.button : theme.subtitle} 
                  />
                  <Text style={{ marginLeft: 10, color: theme.text, fontSize: 14, fontWeight: isSel ? '600' : '400' }}>
                    {cat}
                  </Text>
                </View>
              </TouchableHaptic>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 420, borderRadius: 16, padding: 14, borderWidth: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  optionRow: { paddingHorizontal: 8, paddingVertical: 10, borderRadius: 10, marginTop: 2 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
});