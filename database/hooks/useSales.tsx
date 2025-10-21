import { useUserStore } from "@/store/useUserStore";
import { useCallback, useEffect, useState } from "react";
import { DB_COLLECTION } from "../collection";
import { Q } from "@nozbe/watermelondb";

export function useSales({
  searchParams,
  sort = "desc",
  startDate,
  endDate,
}: {
  searchParams: string;
  sort: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
}) {
  const { activeShopId } = useUserStore();
  const [sales, setSales] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.sales.query();

    if (activeShopId) {
      query = query.extend(Q.where("shopId", activeShopId));
    }

    if (searchParams) {
      const likePattern = `%${searchParams}%`;
      query = query.extend(
        Q.or(
          Q.where("invoiceNumber", Q.like(likePattern)),
          Q.where("paymentType", Q.like(likePattern))
          // Q.where("customerName", Q.like(likePattern))
        )
      );
    }

    if (sort) {
      query = query.extend(Q.sortBy("invoiceDate", sort));
    }

    if (startDate && endDate) {
      query = query.extend(
        Q.where(
          "invoiceDate",
          Q.between(startDate.getTime(), endDate.getTime())
        )
      );
    }

    return query;
  }, [activeShopId, searchParams, startDate, endDate, sort]);

  const loadSales = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      try {
        const query = buildQuery();
        const records = await query.fetch();
        setSales(records?.map((record) => record?._raw));
      } catch (error) {
        console.error("Error loading sales:", error);
      } finally {
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [buildQuery]
  );

  const refresh = useCallback(() => {
    return loadSales(true);
  }, [loadSales]);

  useEffect(() => {
    const query = buildQuery();
    const subscription = query.observe().subscribe((records) => {
      setSales(records?.map((record) => record?._raw));
    });

    return () => subscription.unsubscribe();
  }, [buildQuery]);

  return {
    sales,
    reload: loadSales,
    refresh,
    isRefreshing,
  };
}
