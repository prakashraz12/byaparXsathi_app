
import { Ionicons } from '@expo/vector-icons';
import { ScrollView,StyleSheet, TouchableOpacity, View } from 'react-native';

import { SlideUpModal } from '@/components/re-usables/modal/slide-up.modal';
import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import useShops from '@/database/hooks/useShops';
import { PaymentStatusType } from '@/types/payment-status';
import { formatNumberWithComma } from '@/utils/format-number';

import NotFound from '../re-usables/not-found';

interface PaymentModeSlideupProps {
  visible: boolean;
  onClose: () => void;
  paymentType?: string | null;
  setPaymentType?: (paymentType: string | null) => void;
  setPaymentStatus?: (paymentStatus: PaymentStatusType | null) => void;
  onClickAction?: (paymentType: string) => void;
  setPaymentStatusOpen?: (paymentStatusOpen: boolean) => void;
  setPaymentMode?: (paymentMode: boolean) => void;
}

const PaymentModeSlideup = ({
  visible,
  onClose,
  paymentType,
  setPaymentType,
  setPaymentStatus,
  onClickAction,
  setPaymentStatusOpen,
  setPaymentMode,
}: PaymentModeSlideupProps) => {
  const { currentPaymentAccount } = useShops();
  return (
    <SlideUpModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPaymentType?.(null);
              setPaymentMode?.(false);
            }}
          >
            <Ionicons name="arrow-back" size={25} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Payment Mode</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.optionsList}>
            {currentPaymentAccount?.length === 0 ? (
              <NotFound
                title="No Payment Account Found!"
                description="No any payment  account found! create new one to go,"
              />
            ) : (
              currentPaymentAccount?.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.optionCard, paymentType === account.name && styles.selectedCard]}
                  onPress={() => {
                    onClickAction?.(account?.name as string);
                    onClose();
                    setPaymentStatus?.(null);
                    setPaymentStatusOpen?.(false);
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <View style={[styles.iconContainer]}>
                      <Ionicons
                        name={
                          account.name === 'Bank'
                            ? 'business'
                            : account.name === 'Cash'
                              ? 'cash'
                              : account?.name === 'Online Wallet'
                                ? 'wallet'
                                : 'newspaper'
                        }
                        size={24}
                        color={
                          account.name === 'Bank'
                            ? '#3b82f6'
                            : account.name === 'Cash'
                              ? '#10b981'
                              : account?.name === 'Online Wallet'
                                ? '#f59e0b'
                                : '#ef4444'
                        }
                      />
                    </View>
                    <Text style={styles.optionText}>{account.name}</Text>
                  </View>
                  <Text style={styles.balanceText}>
                    {formatNumberWithComma(account?.balance || 0)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.addAccountButton}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addAccountButtonText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </SlideUpModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidIconBg: {
    backgroundColor: '#d1fae5',
  },
  partialIconBg: {
    backgroundColor: '#fef3c7',
  },
  unpaidIconBg: {
    backgroundColor: '#fee2e2',
  },
  cashIconBg: {
    backgroundColor: '#d1fae5',
  },
  chequeIconBg: {
    backgroundColor: '#dbeafe',
  },
  onlineIconBg: {
    backgroundColor: '#fce7f3',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  balanceText: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'Poppins-Medium',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  addAccountButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  addAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentModeSlideup;
