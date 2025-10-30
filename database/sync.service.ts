import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./index";
import { BASE_API_URL } from "@/config/app.config";
import { useSyncStore } from "@/store/useSync";

interface SyncOptions {
  isFirstTime?: boolean;
  shopId?: string;
  fetchShops?: boolean;
}

export async function syncDatabase({ isFirstTime = false, shopId, fetchShops = false }: SyncOptions) {
  console.log("🚀 Starting sync process...");

  const setSyncing = useSyncStore.getState().setSyncing;
  const setLastSynced = useSyncStore.getState().setLastSynced;

  try {
    setSyncing(true);

    await synchronize({
      database,

      // -------------------------
      // 1️⃣ PULL CHANGES
      // -------------------------
      pullChanges: async ({ lastPulledAt }) => {
        try {
          const lastSync = isFirstTime ? 0 : lastPulledAt || 0;
          console.log("📥 Pulling changes from server...", { lastSync });

          const url = `${BASE_API_URL}/api/v1/sync/pull?lastPulledAt=${lastSync}&shopId=${shopId}&fetchShops=${fetchShops}`;
          const response = await fetch(url);

          console.log("📡 Pull response status:", response.status);

          if (!response.ok) {
            const text = await response.text();
            console.error("❌ Pull failed, server responded with:", text);
            throw new Error(`Pull failed: ${response.status}`);
          }

          const resJson = await response.json();
          const data = resJson?.data;

          console.log("✅ Data received from server:", data);

          if (!data?.changes) {
            console.warn("⚠️ No 'changes' found in response, returning empty dataset.");
            return {
              changes: {
                customer: { created: [], updated: [], deleted: [] },
                shop: { created: [], updated: [], deleted: [] },
                paymentAccount: { created: [], updated: [], deleted: [] },
                item: { created: [], updated: [], deleted: [] },
                salesItem: { created: [], updated: [], deleted: [] },
                sales: { created: [], updated: [], deleted: [] },
              },
              timestamp: Date.now(),
            };
          }


          const safeChanges = {
            customer: { created: data.changes.customer?.created ?? [], updated: data.changes.customer?.updated ?? [], deleted: data.changes.customer?.deleted ?? [] },

            shop: { created: data.changes.shop?.created ?? [], updated: data.changes.shop?.updated ?? [], deleted: data.changes.shop?.deleted ?? [] },

            paymentAccount: { created: data.changes.paymentAccount?.created ?? [], updated: data.changes.paymentAccount?.updated ?? [], deleted: data.changes.paymentAccount?.deleted ?? [] },

            item: { created: data.changes.item?.created ?? [], updated: data.changes.item?.updated ?? [], deleted: data.changes.item?.deleted ?? [] },

            salesItem: { created: data.changes.salesItem?.created ?? [], updated: data.changes.salesItem?.updated ?? [], deleted: data.changes.salesItem?.deleted ?? [] },

            sales: { created: data.changes.sales?.created ?? [], updated: data.changes.sales?.updated ?? [], deleted: data.changes.sales?.deleted ?? [] },
          };

          return {
            changes: safeChanges,
            timestamp: data.timestamp || Date.now(),
          };
        } catch (error) {
          console.error("❌ Error during pullChanges:", error);
          throw new Error("Pull failed while fetching from server.");
        }
      },

      // -------------------------
      // 2️⃣ PUSH CHANGES
      // -------------------------
      pushChanges: async ({ changes, lastPulledAt }) => {
        console.log("📤 Pushing local changes to server...", { lastPulledAt });

        try {
          const response = await fetch(`${BASE_API_URL}/api/v1/sync/push`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ changes, lastPulledAt }),
          });

          if (!response.ok) {
            const text = await response.text();
            console.error("❌ Push failed, server responded with:", text);
            throw new Error(`Push failed: ${response.status}`);
          }

          console.log("✅ Push successful!");
        } catch (error) {
          console.error("❌ Error during pushChanges:", error);
          throw error;
        }
      },
    });

    // -------------------------
    // ✅ SUCCESS HANDLING
    // -------------------------
    setLastSynced(new Date().toISOString());
    console.log("✅ Sync completed successfully!");
  } catch (err) {
    console.error("❌ Sync failed:", err);
  } finally {
    setSyncing(false);
  }
}
