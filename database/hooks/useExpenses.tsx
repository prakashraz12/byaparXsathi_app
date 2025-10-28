import { useUserStore } from "@/store/useUserStore";
import { useCallback, useEffect, useState } from "react";
import Expenses from "../model/expenses.model";
import { DB_COLLECTION } from "../collection";
import { Q } from "@nozbe/watermelondb";

const useExpenses = ({searchParams}:{searchParams?:string}) => {
   const { activeShopId } = useUserStore();
     const [expenses, setExpenses] = useState<Expenses[]>([]);
     const [isRefreshing, setIsRefreshing] = useState(false); 

     const buildQuery = useCallback(() => {
        let query = DB_COLLECTION.expenses.query();

        if (activeShopId) {
          query = query.extend(Q.where("shopId", activeShopId));
        }

       if (searchParams) {
      const likePattern = `%${searchParams}%`;
      query = query.extend(
        Q.or(
          Q.where("title", Q.like(likePattern)),
          Q.where("remarks", Q.like(likePattern))
        )
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
            setExpenses(records?.map((record) => record?._raw));
          } catch (error) {
            console.error("Error loading expenses:", error);
          } finally {
            if (isRefresh) setIsRefreshing(false);
          }
        },
        [buildQuery]
      );

      const refresh = useCallback(() => {
        return loadExpenses(true);
      }, [loadExpenses]);

      useEffect(() => {
        const query = buildQuery();
        const subscription = query.observe().subscribe((records) => {
          setExpenses(records?.map((record) => record?._raw as Expenses));
        });

        return () => subscription.unsubscribe();
      }, [buildQuery]);

      return {
        expenses,
        reload: loadExpenses,
        refresh,
        isRefreshing,
      };
    }
    export default useExpenses;
