import { useCallback } from "react";
import { synchronize } from "@nozbe/watermelondb/sync";
import database from "../index";
import { useSyncStore } from "@/store/useSync";
import {
  fetchSyncControllerPull,
  useSyncControllerPush,
} from "@/service/queries-components";
import { useUserStore } from "@/store/useUserStore";
import { PushSyncDto } from "@/service/types-schemas";
import { SCHEMA_KEYS } from "../shema.keys";

interface SyncOptions {
  isFirstTime?: boolean;
  fetchShops?: boolean;
}

export const useSync = () => {
  const { setSyncing, setLastSynced } = useSyncStore();
  const { activeShopId } = useUserStore();

  const { mutateAsync } = useSyncControllerPush();

  const syncNow = useCallback(
    async ({ isFirstTime = false, fetchShops = false }: SyncOptions = {}) => {
      // console.log("🚀 Starting sync process...");
      setSyncing(true);

      try {
        await synchronize({
          database,

          // -------------------------
          // 1️⃣ PULL CHANGES
          // -------------------------
          pullChanges: async ({ lastPulledAt }) => {
            const lastSync = isFirstTime ? 0 : lastPulledAt || 0;
            console.log("📥 Pulling changes...", { lastSync });

            const res = await fetchSyncControllerPull({
              queryParams: {
                lastPulledAt: lastSync,
                shopId: activeShopId || "",
                fetchShops,
              },
            });

            const data = res?.data;

            if (!data?.changes) {
              console.warn(
                "⚠️ No 'changes' returned from pull, returning empty dataset."
              );
              return {
                changes: {
                  [SCHEMA_KEYS.CUSTOMER]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.SHOP]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.PAYMENT_ACCOUNT]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.ITEM]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.SALES_ITEM]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.SALES]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.INCOME]: { created: [], updated: [], deleted: [] },
                  [SCHEMA_KEYS.EXPENSES]: { created: [], updated: [], deleted: [] },
                },
                timestamp: Date.now(),
              };
            }

            // Ensure all arrays exist
            const safeChanges = {
              [SCHEMA_KEYS.CUSTOMER]: {
                created: data.changes.customer.created ?? [],
                updated: data.changes.customer.updated ?? [],
                deleted: data.changes.customer.deleted ?? [],
              },
              [SCHEMA_KEYS.SHOP]: {
                created: data.changes.shop.created ?? [],
                updated: data.changes.shop?.updated ?? [],
                deleted: data.changes.shop?.deleted ?? [],
              },
              [SCHEMA_KEYS.PAYMENT_ACCOUNT]: {
                created: data.changes.paymentAccount?.created ?? [],
                updated: data.changes.paymentAccount?.updated ?? [],
                deleted: data.changes.paymentAccount?.deleted ?? [],
              },  
              [SCHEMA_KEYS.ITEM]: {
                created: data.changes.item?.created ?? [],
                updated: data.changes.item?.updated ?? [],
                deleted: data.changes.item?.deleted ?? [],
              },
              [SCHEMA_KEYS.SALES_ITEM]: {
                created: data.changes.salesItems?.created ?? [],
                updated: data.changes.salesItems?.updated ?? [],
                deleted: data.changes.salesItems?.deleted ?? [],
              },
              [SCHEMA_KEYS.SALES]: {
                created: data.changes.sales?.created ?? [],
                updated: data.changes.sales?.updated ?? [],
                deleted: data.changes.sales?.deleted ?? [],
              },
              [SCHEMA_KEYS.INCOME]: {
                created: data.changes.income?.created ?? [],
                updated: data.changes.income?.updated ?? [],
                deleted: data.changes.income?.deleted ?? [],
              },
              [SCHEMA_KEYS.EXPENSES]: {
                created: data.changes.expenses?.created ?? [],
                updated: data.changes.expenses?.updated ?? [],
                deleted: data.changes.expenses?.deleted ?? [],
              },
            };
            console.log("safely pulled");
            return {
              changes: safeChanges,
              timestamp: data.timestamp || Date.now(),
            };
          },

          // -------------------------
          // 2️⃣ PUSH CHANGES
          // -------------------------
          pushChanges: async ({ changes, lastPulledAt }) => {
            console.log("pushing changes");
            await mutateAsync({
              body: {
                changes: changes as PushSyncDto["changes"],
                lastPulledAt: lastPulledAt,
              },
            });
            return;
          },
        });

        // -------------------------
        // ✅ SUCCESS HANDLING
        // -------------------------
        setLastSynced(new Date().toISOString());
        console.log("✅ Sync completed successfully!");
      } catch (err) {
      } finally {
        setSyncing(false);
      }
    },
    [setSyncing, setLastSynced, activeShopId, mutateAsync]
  );

  return { syncNow };
};
