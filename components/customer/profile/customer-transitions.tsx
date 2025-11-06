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

  const { sales, isLoading } = useSales({
    customerId: id,
    searchParams,
    sort: 'desc',
  });

  const { paymentIn } = usePaymentIn({ searchParams, sort: 'desc', customerId: id });

  const data = [
    ...sales?.map((sale) => ({ ...sale, type: 'sale' })),
    ...paymentIn?.map((payment) => ({ ...payment, type: 'paymentIn' })),
  ];

  console.log(paymentIn)
  return (
    <View>
      <View
        style={{
          flex: 1,
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginBottom: 10,
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
        ) : sales?.length === 0 ? (
          <NotFound title="No Transactions Found" />
        ) : (
          data?.map((item) =>{
            if(item.type === 'sale'){
              return <SalesCard
              id={item.id}
              key={item.id}
              invoiceNumber={item.invoiceNumber}
              invoiceDate={item?.invoiceDate}
              grandTotalAmount={item.grandTotalAmount}
              paymentStatus={item.status}
              paymentType={item.paymentType}
            />
            }
            if(item.type === 'paymentIn'){
              return <PaymentInCard
              id={item.id}
              key={item.id}
              receiptNumber={item.receiptNumber}
              paymentDate={item?.paymentDate}
              amount={item.amount}
              paymentId={item.paymentId}
            />
            }
          })
        )}
      </View>
    </View>
  );
};

export default CustomerTransitions;
