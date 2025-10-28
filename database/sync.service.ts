import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./index";
import { BASE_API_URL } from "@/config/app.config";
import { useSyncStore } from "@/store/useSync";

export async function syncDatabase({isFirstTime = false}:{isFirstTime?:boolean}) {
   
  try {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        console.log("pu;;;imggg...")
        const response = await fetch(
          `${BASE_API_URL}/api/v1/sync/pull?lastPulledAt=${isFirstTime ? null : lastPulledAt || 0}`
        );
        if (!response.ok) throw new Error("Pull failed");

        const resJson = await response.json();

        const data = resJson.data;
        console.log("datasssc",resJson?.data)

        if (!data?.changes?.customer) {
          return {
            changes: { customer: { created: [], updated: [], deleted: [] },  },
            timestamp: Date.now(),
          };
        }

        if(!data?.changes?.shop){
          console.log("shop not found", data?.changes?.shop)
          return {
            changes: { customer: data.changes.customer, shop:{created:[],updated:[],deleted:[]}, item:data?.changes?.item },
            timestamp: data.timestamp || Date.now(),
          };
        }
      
        console.log("data",data?.changes)
        return {
          changes: { customer: data.changes.customer, shop:data?.changes?.shop },
          timestamp: data.timestamp || Date.now(),
        };
      },

      pushChanges: async ({ changes, lastPulledAt }) => {
        console.log("pushing changes", changes)
        try {
          const response = await fetch(`${BASE_API_URL}/api/v1/sync/push`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ changes, lastPulledAt }),
          });
  
          if (!response.ok) {
            throw new Error(await response.text());
          }
        } catch (error) {
          console.log("error",error)
        }
      },
    });

    useSyncStore.getState().setLastSynced(new Date().toISOString());
    useSyncStore.getState().setSyncing(false);
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
}
