// import * as BackgroundFetch from "expo-background-task";
// import * as TaskManager from "expo-task-manager";
// import { useEffect, useState } from "react";

// const BACKGROUND_TASK_IDENTIFIER = "background-fetch-task";

// // Define background task
// TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
//   try {
//     const now = new Date().toISOString();
//     console.log(`⏰ Background task executed at: ${now}`);

//     // Perform your background logic here (e.g. API sync)
//     // return BackgroundFetch.BackgroundFetchResult.NewData; // if new data fetched
//     return BackgroundFetch.BackgroundTaskResult.NewData;
//   } catch (error) {
//     console.error("❌ Background task failed:", error);
//     return BackgroundFetch.BackgroundTaskResult.Failed;
//   }
// });

// // Hook to manage background task registration
// const useBackgroundSync = () => {
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [status, setStatus] = useState<BackgroundFetch.BackgroundTaskResult | null>(null);

//   const updateAsync = async () => {
//     const status = await BackgroundFetch.getStatusAsync();
//     setStatus(status);

//     const registered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
//     setIsRegistered(registered);
//   };

//   const registerTaskAsync = async () => {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
//       minimumInterval: 60 * 15, // 15 minutes
//       stopOnTerminate: false,   // Android only
//       startOnBoot: true,        // Android only
//     });
//     await updateAsync();
//   };

//   const unregisterTaskAsync = async () => {
//     await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
//     await updateAsync();
//   };

//   useEffect(() => {
//     updateAsync();
//   }, []);

//   return { isRegistered, status, registerTaskAsync, unregisterTaskAsync };
// };

// export default useBackgroundSync;
