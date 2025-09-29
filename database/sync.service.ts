import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./index";
import { BASE_API_URL } from "@/config/app.config";


export async function syncDatabase() {
  try {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        console.log("Pulling changes... lastPulledAt:", lastPulledAt);
      
        const response = await fetch(`${BASE_API_URL}/api/v1/sync/pull?lastPulledAt=${lastPulledAt || 0}`);
        if (!response.ok) throw new Error("Pull failed");
      
        const resJson = await response.json();
        console.log(resJson, "this is resJson")
      
        // unwrap your data object
        const data = resJson.data;
        console.log(data?.changes?.customer, "this is customer up")
      
        if (!data?.changes?.customer) {
          return { changes: { customer: { created: [], updated: [], deleted: [] } }, timestamp: Date.now() };
        }
      
        console.log(data?.changes?.customer, "this is customer")
        return {
          changes: { customer: data.changes.customer },
          timestamp: data.timestamp || Date.now(),
        };
      },

      pushChanges: async ({ changes, lastPulledAt }) => {
        console.log("Pushing changes...");
        // send local changes to server
        const response = await fetch(`${BASE_API_URL}/api/v1/sync/push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ changes, lastPulledAt }),
        });

        if (!response.ok) throw new Error("Push failed");
      },
    });

    console.log("✅ Sync completed!");
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
}
