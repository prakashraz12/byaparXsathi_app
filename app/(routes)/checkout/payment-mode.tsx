import { Lightbulb} from 'lucide-react-native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BadgeSelector from '@/components/re-usables/badge-selector';
import { COLORS } from '@/constants/Colors';
import { formatNumberWithComma } from '@/utils/format-number';

interface PaymentModeProps {
  paymentMode: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID';
  setPaymentMode: (paymentMode: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID') => void;
  paymentId: string;
  setPaymentId: (paymentId: string) => void;
  paidAmount: string;
  setPaidAmount: (paidAmount: string) => void;
  grandTotal: number;
  dueAmount: number;
  currentPaymentAccount: any;
}
const PaymentMode = ({
  paymentMode,
  setPaymentMode,
  paymentId,
  setPaymentId,
  paidAmount,
  setPaidAmount,
  grandTotal,
  dueAmount,
  currentPaymentAccount,
}: PaymentModeProps) => {
  console.log(currentPaymentAccount, "this is current oayamnrt mde")
  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        padding: 15,
      }}
    >
      <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Payment Mode</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: COLORS.cardBackground,
          padding: 5,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: COLORS.border,
          marginTop: 15,
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: paymentMode === 'PAID' ? COLORS.primary : 'transparent',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: paymentMode === 'PAID' ? COLORS.primary : "transparent",
            width: '25%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setPaymentMode('PAID')}
        >
          <Text
            style={{
              color: paymentMode === 'PAID' ? 'white' : COLORS.text,
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
            }}
          >
            Paid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: paymentMode === 'UNPAID' ? COLORS.primary : 'transparent',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: paymentMode === 'UNPAID' ? COLORS.primary : "transparent",
            width: '28%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setPaymentMode('UNPAID')}
        >
          <Text
            style={{
              color: paymentMode === 'UNPAID' ? 'white' : COLORS.text,
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
            }}
          >
            Unpaid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            backgroundColor: paymentMode === 'PARTIALLY_PAID' ? COLORS.primary : 'transparent',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: paymentMode === 'PARTIALLY_PAID' ? COLORS.primary : "transparent",
            width: '31%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setPaymentMode('PARTIALLY_PAID')}
        >
          <Text
            style={{
              color: paymentMode === 'PARTIALLY_PAID' ? 'white' : COLORS.text,
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
            }}
          >
            Partial Paid
          </Text>
        </TouchableOpacity>
      </View>

      {paymentMode !== 'UNPAID' && (
        <View style={{ marginTop: 10 }}>
          <BadgeSelector
            options={
              currentPaymentAccount?.map((i: any) => ({
                label: i?.name,
                value: i?.name,
              })) as any
            }
            value={paymentId || ''}
            onChange={setPaymentId}
          />
        </View>
      )}
      {paymentMode !== 'UNPAID' && paymentMode !== 'PAID' && (
        <View>
          <View style={styles.amountContainer}>
            <View style={styles.totalAmountRow}>
              <Text style={styles.labelText}>Total Amount</Text>
              <Text style={styles.amountText}>{formatNumberWithComma(grandTotal)}</Text>
            </View>
            <View style={styles.receivedAmountRow}>
              <Text style={styles.labelText}>Received Amount</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                autoFocus
                focusable
                value={paidAmount}
                onChangeText={(text) => setPaidAmount(text)}
                style={styles.amountInput}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ color: COLORS.error }}>Due Amount</Text>
            <Text style={{ color: COLORS.error }}>{formatNumberWithComma(dueAmount)}</Text>
          </View>
        </View>
      )}
      {paymentMode !== 'PAID' && (
        <View
          style={{
            backgroundColor: COLORS.primaryLight,
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
            flexDirection: 'row',
            gap: 10,
            flex: 1,
            overflow: 'visible',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Lightbulb size={19} color={COLORS.text} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Regular',
              color: COLORS.text,
              overflow: 'visible',
            }}
          >
            Unpaid sales and partially paid sales only made when customer is added.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  amountContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginTop: 15,
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receivedAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
export default PaymentMode;
