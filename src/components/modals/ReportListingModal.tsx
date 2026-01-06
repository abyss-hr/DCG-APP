// ReportListingModal - Report issues with a listing
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, AlertCircle } from 'lucide-react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/database/firebaseConfig';
import { useTheme } from '@/theme';
import TouchableHaptic from '@/components/ui/TouchableHaptic';

interface Props {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const ISSUE_TYPES = [
  { id: 'bug', label: 'Technical issue or bug' },
  { id: 'wrong-info', label: 'Wrong information' },
  { id: 'ownership', label: 'I own this listing' },
  { id: 'closed', label: 'Permanently closed' },
  { id: 'duplicate', label: 'Duplicate listing' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'other', label: 'Other issue' },
];

export function ReportListingModal({ visible, onClose, listingId, listingTitle }: Props) {
  const { theme } = useTheme();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  console.log('Modal render - visible:', visible, 'issue types:', ISSUE_TYPES.length);

  const handleSubmit = async () => {
    if (!selectedIssue) {
      Alert.alert('Required', 'Please select an issue type');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return;
    }

    setSubmitting(true);

    try {
      // Save to Firebase 'reports' collection
      const reportData = {
        listingId,
        listingTitle,
        issueType: selectedIssue,
        email: email.trim(),
        details: details.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending', // For admin dashboard filtering
      };

      const reportsRef = collection(db, 'reports');
      await addDoc(reportsRef, reportData);

      Alert.alert(
        'Thank you!',
        'Your report has been submitted. We\'ll review it shortly.',
        [{ text: 'OK', onPress: () => {
          handleClose();
        }}]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedIssue(null);
    setEmail('');
    setDetails('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView 
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AlertCircle size={24} color={theme.button} strokeWidth={2} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Report Issue
              </Text>
            </View>
            <TouchableHaptic onPress={handleClose} haptic="light">
              <X size={24} color={theme.subtitle} strokeWidth={2} />
            </TouchableHaptic>
          </View>

          {/* Listing Info */}
          <View style={[styles.listingInfo, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.listingTitle, { color: theme.text }]} numberOfLines={1}>
              {listingTitle}
            </Text>
            <Text style={[styles.listingId, { color: theme.subtitle }]}>
              ID: {listingId}
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Issue Types */}
            <Text style={[styles.label, { color: theme.text }]}>
              What's the issue? *
            </Text>
            <View style={styles.issueTypes}>
              {ISSUE_TYPES.map((issue) => (
                <TouchableHaptic
                  key={issue.id}
                  style={styles.issueOption}
                  onPress={() => setSelectedIssue(issue.id)}
                  haptic="light"
                >
                  <Text style={[styles.issueLabel, { color: theme.text }]}>
                    {issue.label}
                  </Text>
                  <View style={[styles.radioOuter, { borderColor: theme.border }]}>
                    {selectedIssue === issue.id && (
                      <View style={[styles.radioDot, { backgroundColor: theme.button }]} />
                    )}
                  </View>
                </TouchableHaptic>
              ))}
            </View>

            {/* Additional Details */}
            <Text style={[styles.label, { color: theme.text }]}>
              Additional details (optional)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Tell us more about the issue..."
              placeholderTextColor={theme.subtitle}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Email */}
            <Text style={[styles.label, { color: theme.text }]}>
              Your email *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="your@email.com"
              placeholderTextColor={theme.subtitle}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableHaptic
              style={[styles.cancelButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleClose}
              haptic="light"
            >
              <Text style={[styles.cancelButtonText, { color: theme.subtitle }]}>
                Cancel
              </Text>
            </TouchableHaptic>

            <TouchableHaptic
              style={[
                styles.submitButton,
                { 
                  backgroundColor: theme.button,
                  opacity: submitting ? 0.6 : 1,
                },
              ]}
              onPress={handleSubmit}
              haptic="medium"
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Text>
            </TouchableHaptic>
          </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listingInfo: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  listingId: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  issueTypes: {
    marginBottom: 16,
  },
  issueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  issueLabel: {
    fontSize: 15,
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
