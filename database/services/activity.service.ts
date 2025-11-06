import { responseHandler } from '../util/response-handler';
import database from '../index';
import { DB_COLLECTION } from '../collection';
import { Activity } from '../model/activity.model';

export const activityService = {
  create: async (activityData: Partial<Activity>) => {
    try {
      const result = await database.write(async () => {
        await DB_COLLECTION.activity.create((a) => {
          a.title = activityData.title || '';
          a.description = activityData.description || '';
          a.type = activityData.type || '';
          a.created_at = Date.now();
          a.updated_at = Date.now();
          a.shopId = activityData.shopId || '';
          a.platform = activityData.platform || '';
        });
        return responseHandler({
          message: 'Activity created successfully',
          statusCode: 201,
          data: null,
        });
      });
      return result;
    } catch (error) {
      console.log('Failed to create activity', error);
      return responseHandler({
        message: 'Failed to create activity',
        statusCode: 500,
        success: false,
        data: null,
      });
    }
  },
};
