import { useUserStore } from "@/store/useUserStore";
import { Q } from "@nozbe/watermelondb";
import { useCallback, useEffect, useState } from "react";
import { DB_COLLECTION } from "../collection";
import Item from "../model/item.model";

export function useItems({
  search = "",
  sortBy = "asc",
  sortByStock = "asc",
}: {
  search?: string;
  sortBy?: "asc" | "desc";
  sortByStock?: "asc" | "desc";
}) {
  const { activeShopId } = useUserStore();
  const [items, setItems] = useState<Item[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buildQuery = useCallback(() => {
    let query = DB_COLLECTION.item.query();

    if (activeShopId) {
      query = query.extend(Q.where("shopId", activeShopId));
    }

    if (search) {
      query = query.extend(
        Q.where("item_name", Q.like(`%${Q.sanitizeLikeString(search)}%`))
      );
    }

    if (sortBy) {
      query = query.extend(Q.sortBy("item_name", sortBy === "asc" ? Q.asc : Q.desc));
    }
    if (sortByStock) {
      query = query.extend(Q.sortBy("current_stock", sortByStock === "asc" ? Q.asc : Q.desc));
    }

    return query;
  }, [search, sortBy, sortByStock, activeShopId]);

  const loadItems = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      try {
        const query = buildQuery();
        const records = await query.fetch();
        setItems(records);
      } catch (error) {
        console.error("Error loading items:", error);
      } finally {
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [buildQuery]
  );

  const refresh = useCallback(() => {
    return loadItems(true);
  }, [loadItems]);

  useEffect(() => {
    const query = buildQuery();
    const subscription = query.observe().subscribe((records) => {
      setItems(records);
    });

    return () => subscription.unsubscribe();
  }, [buildQuery]);

  return {
    items,
    reload: loadItems,
    refresh,
    isRefreshing,
  };
}
