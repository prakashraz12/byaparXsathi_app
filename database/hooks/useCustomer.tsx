import { Q } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/store/useUserStore';

import { DB_COLLECTION } from '../collection';
import Customer from '../model/customer.model';

export function useCustomers({
  search = '',
  sortBy = 'name',
}: {
  search?: string;
  sortBy?: keyof Omit<Customer, 'table' | 'createdAt' | 'updatedAt'>;
}) {
  const { activeShopId } = useUserStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.customer.query(Q.where('shopId', activeShopId));

    if (search) {
      query = query.extend(Q.where('name', Q.like(`%${Q.sanitizeLikeString(search)}%`)));
    }

    if (sortBy) {
      query = query.extend(Q.sortBy(sortBy, Q.asc));
    }

    return query;
  }, [search, sortBy, activeShopId]);

  const loadCustomers = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);

      try {
        setLoading(true);
        const query = buildQuery();
        const records = await query.fetch();
        setCustomers(records);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        if (isRefresh) setIsRefreshing(false);
        setLoading(false);
      }
    },
    [buildQuery],
  );

  const refresh = useCallback(() => {
    return loadCustomers(true);
  }, [loadCustomers]);

  useEffect(() => {
    const query = buildQuery();
    const subscription = query.observe().subscribe((records) => {
      setCustomers(records);
    });

    return () => subscription.unsubscribe();
  }, [buildQuery]);

  return {
    customers,
    reload: loadCustomers,
    refresh,
    isRefreshing,
    loading,
  };
}
