import { useUserStore } from "@/store/useUserStore";
import { useCallback, useEffect, useState } from "react";
import Expenses from "../model/expenses.model";
import { DB_COLLECTION } from "../collection";
import { Q } from "@nozbe/watermelondb";
import Income from "../model/income.model";

const useIncome = ({ searchParams }: { searchParams?: string }) => {
  const { activeShopId } = useUserStore();
  const [income, setIncome] = useState<Income[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.income.query();

    if (activeShopId) {
      query = query.extend(Q.where("shopId", activeShopId));
    }

    if (searchParams) {
      const likePattern = `%${searchParams}%`;
      query = query.extend(
        Q.or(
          Q.where("incomeSource", Q.like(likePattern)),
          Q.where("remarks", Q.like(likePattern)),
        ),
      );
    }

    return query;
  }, [activeShopId, searchParams]);

  const loadExpenses = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      try {
        const query = buildQuery();
        const records = await query.fetch();
        setIncome(records?.map((record) => record?._raw as any));
      } catch (error) {
        console.error("Error loading income:", error);
      } finally {
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [buildQuery],
  );

  const refresh = useCallback(() => {
    return loadExpenses(true);
  }, [loadExpenses]);

  useEffect(() => {
    const query = buildQuery();
    const subscription = query.observe().subscribe((records) => {
      setIncome(records?.map((record) => record?._raw as any));
    });

    return () => subscription.unsubscribe();
  }, [buildQuery]);

  return {
    income,
    reload: loadExpenses,
    refresh,
    isRefreshing,
  };
};
export default useIncome;
