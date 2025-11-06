import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';

import AddCustomerModal from '@/components/customer/add-customer.modal';
import CustomerCard from '@/components/customer/customer-card';
import HHeader from '@/components/re-usables/h-header';
import Input from '@/components/re-usables/input';
import { useCustomers } from '@/database/hooks/useCustomer';
import Item from '@/database/model/item.model';
import PXWrapper from '@/layouts/px-wrapper';

export const CustomerScreen: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');

  const { customers } = useCustomers({
    search: customerName,
    sortBy: 'created_at',
  });

  return (
    <PXWrapper
      floatingAction={<AddCustomerModal />}
      header={
        <>
          <HHeader title="Customer" />
          <Input
            value={customerName}
            placeholder="Search customers"
            leftIcon={<Search />}
            onChangeText={setCustomerName}
          />
        </>
      }
      data={customers}
      renderItem={({ item }: { item: Item }) => (
        <CustomerCard customer={item} onPress={() => router.push(`/customer/${item?.id}`)} />
      )}
    />
  );
};
