import { Q } from "@nozbe/watermelondb";
import { useCallback, useEffect, useState } from "react";
import database from "../index";
import Customer from "../model/customer.model";
import { DB_COLLECTION } from "../collection";
import { useUserStore } from "@/store/useUserStore";

export function useCustomers({
  search = "",
  sortBy = "name",
  limit = 20,
}: {
  search?: string;
  sortBy?: keyof Omit<Customer, "table" | "createdAt" | "updatedAt">;
  limit?: number;
}) {
  const {activeShopId} = useUserStore();
  console.log(activeShopId, "this is active shop")
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.customer.query(Q.where("shop_idx", activeShopId));
    
    if (search) {
      query = query.extend(
        Q.where("name", Q.like(`%${Q.sanitizeLikeString(search)}%`))
      );
    }
    
    if (sortBy) {
      query = query.extend(Q.sortBy(sortBy, Q.asc));
    }
    
    query = query.extend(Q.take(limit));
    
    return query;
  }, [search, sortBy, limit, activeShopId]);

  const loadCustomers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    
    try {
      const query = buildQuery();
      const records = await query.fetch();
      setCustomers(records);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      if (isRefresh) setIsRefreshing(false);
    }
  }, [buildQuery]);

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
    isRefreshing 
  };
}