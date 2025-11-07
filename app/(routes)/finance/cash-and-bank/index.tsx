import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/re-usables/button';
import { Header } from '@/components/re-usables/header';
import NotFound from '@/components/re-usables/not-found';
import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import useShops from '@/database/hooks/useShops';
import PaymentAccount from '@/database/model/payment-account.model';
import PXWrapper from '@/layouts/px-wrapper';
import { formatNumberWithComma } from '@/utils/format-number';
import { ArrowLeftRight } from 'lucide-react-native';

const CashAndBankAccounts = () => {
  const { currentPaymentAccount } = useShops();

  const total = useMemo(() => {
    return (
      currentPaymentAccount?.reduce(
        (sum: number, account: PaymentAccount) => sum + (account.balance || 0),
        0,
      ) || 0
    );
  }, [currentPaymentAccount]);
  return (
    <PXWrapper
      footer={
        <Button
          style={{ marginBottom: 10, paddingVertical: 15 }}
          title="Add Account"
          onPress={() => router.push('/')}
        />
      }
      header={<Header title="Cash & Bank Accounts" onBackPress={() => router.back()} />}
    >
      <View
        style={{
          padding: 15,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: COLORS.border,
          backgroundColor: COLORS.background,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: 'gray' }}>
          Total Balance
        </Text>
        <Text
          style={{
            fontSize: 20,
            marginTop: 10,
            fontFamily: 'Poppins-Medium',
            color: COLORS.success,
          }}
        >
          {formatNumberWithComma(total)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop:15, justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Available Accounts</Text>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: COLORS.background, flexDirection:"row", alignItems: 'center', gap: 5, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <ArrowLeftRight size={18} color={COLORS.success} />
          </View>
          <Text style={{ color: COLORS.success, fontSize:14 }}>Adjust Balance</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionsList}>
        {currentPaymentAccount?.length === 0 ? (
          <NotFound
            title="No Payment Account Found!"
            description="No any payment  account found! create new one to go,"
          />
        ) : (
          currentPaymentAccount?.map((account) => (
            <View key={account.id} style={[styles.optionCard]}>
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
              <Text style={styles.balanceText}>{formatNumberWithComma(account?.balance || 0)}</Text>
            </View>
          ))
        )}
      </View>
      <View style={{ height: 30 }} />
    </PXWrapper>
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
    marginTop: 20,
  },
  optionCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
export default CashAndBankAccounts;
