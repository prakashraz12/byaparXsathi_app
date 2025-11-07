import { Trash2 } from "lucide-react-native";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/re-usables/text";

const RemarksSection = ({
  notes,
  onNotesChange,
  onRemove,
}: {
  notes: string;
  onNotesChange: (value: string) => void;
  onRemove: () => void;
}) => (
  <View style={styles.remarksContainer}>
    <View style={styles.remarksHeader}>
      <Text style={styles.remarksLabel}>Notes or Remarks</Text>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
    <TextInput
      style={styles.notesInput}
      value={notes}
      onChangeText={onNotesChange}
      placeholder="Enter notes or remarks..."
      placeholderTextColor="#999"
      multiline
      numberOfLines={3}
      textAlignVertical="top"
    />
  </View>
);

const styles = StyleSheet.create({
  remarksContainer: {
    gap: 8,
    paddingHorizontal: 10,
  },
  remarksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  remarksLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Poppins-Medium',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
  },
});

export default RemarksSection;