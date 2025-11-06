import { Q } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/store/useUserStore';

import { DB_COLLECTION } from '../collection';
import PaymentIn from '../model/paymentIn.model';

export function usePaymentIn({
  searchParams,
  sort = 'desc',
  startDate,
  endDate,
  paymentType,
  customerId,
}: {
  searchParams: string;
  sort: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
  paymentType?: string;
  customerId?: string;
}) {
  const { activeShopId } = useUserStore();
  const [paymentIn, setPaymentIn] = useState<PaymentIn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.paymentIn.query();

    if (activeShopId) {
      query = query.extend(Q.where('shopId', activeShopId));
    }

    if (searchParams) {
      const likePattern = `%${searchParams}%`;
      query = query.extend(
        Q.or(
          Q.where('receiptNumber', Q.like(likePattern))
        ),
      );
    }

    // if (sort) {
    //   query = query.extend(Q.sortBy('paymentInDate', sort));
    // }

    if (startDate !== undefined && endDate !== undefined) {
      query = query.extend(
        Q.where('paymentInDate', Q.between(startDate.getTime(), endDate.getTime())),
      );
    }

    if (paymentType) {
      query = query.extend(Q.where('paymentId', paymentType));
    }

    

    if (customerId) {
      query = query.extend(Q.where('customerId', customerId));
    }

    return query;
  }, [
    activeShopId,
    searchParams,
    startDate,
    endDate,
    sort,
    paymentType,
    customerId,
  ]);

  

  

  useEffect(() => {
    setIsLoading(true);
    const query = buildQuery();
    const subscription = query.observe().subscribe((records) => {
      setPaymentIn(records?.map((record) => record?._raw as any));
    });
    setIsLoading(false);
    return () => subscription.unsubscribe();
  }, [buildQuery]);

  return {
    paymentIn,
    isLoading,
  };
}
