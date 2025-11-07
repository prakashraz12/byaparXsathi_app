import { FilterIcon, Search } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import CustomInput from '@/components/re-usables/input';
import NotFound from '@/components/re-usables/not-found';
import SalesCard from '@/components/sales/sales-card';
import { COLORS } from '@/constants/Colors';
import { usePaymentIn } from '@/database/hooks/usePaymentIn';
import { useSales } from '@/database/hooks/useSales';

import PaymentInCard from '../paymentin-card';

const CustomerTransitions = ({ id }: { id: string }) => {
  const [searchParams, setSearchParams] = useState<string>('');

  const { sales, isLoading: isLoadingSales } = useSales({
    customerId: id,
    searchParams,
    sort: 'desc',
  });

  const { paymentIn, isLoading: isLoadingPayments } = usePaymentIn({
    customerId: id,
    searchParams,
    sort: 'desc',
  });

  const isLoading = isLoadingSales || isLoadingPayments;

  const data =
    [...(sales || []).map((s) => ({ ...s, type: 'sale' })), ...(paymentIn || []).map((p) => ({ ...p, type: 'paymentIn' }))]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginVertical: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomInput
            containerStyle={{ flex: 1 }}
            placeholder="Search transactions"
            leftIcon={<Search />}
            value={searchParams}
            onChangeText={setSearchParams}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <FilterIcon size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : data.length === 0 ? (
          <NotFound title="No Transactions Found" />
        ) : (
          data.map((item) => {
            if (item.type === 'sale') {
              return (
                <SalesCard
                  key={item.id}
                  id={item.id}
                  invoiceNumber={item.invoiceNumber}
                  invoiceDate={item.invoiceDate}
                  grandTotalAmount={item.grandTotalAmount}
                  paymentStatus={item.status}
                  paymentType={item.paymentType}
                />
              );
            }
            if (item.type === 'paymentIn') {
              return (
                <PaymentInCard
                  key={item.id}
                  id={item.id}
                  receiptNumber={item.receiptNumber}
                  paymentDate={item.paymentInDate}
                  amount={item.amount}
                  paymentId={item.paymentId}
                />
              );
            }
          })
        )}
      </View>
    </View>
  );
};

export default CustomerTransitions;
