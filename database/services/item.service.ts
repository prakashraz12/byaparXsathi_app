import database from '..';
import { DB_COLLECTION } from '../collection';
import Item from '../model/item.model';
import { Q } from '@nozbe/watermelondb';
import { Toast } from '@/components/re-usables/custom-toaster/toast-service';
import { idxGenerator } from '@/utils/idx.utils';
import { responseHandler } from '../util/response-handler';

export const itemService = {
  create: (item: Partial<Item> & { idx?: string }, SHOPID: string) => {
    return database
      .write(async () => {
        if (!item?.itemName || !item?.measurementUnit || !item?.sellingPrice) {
          const errorMsg = `Missing required fields: ${
            !item?.itemName ? 'itemName ' : ''
          }${!item?.measurementUnit ? 'measurementUnit ' : ''}${
            !item?.sellingPrice ? 'sellingPrice' : ''
          }`.trim();

          Toast.error(errorMsg);
          return;
        }

        const existingItemWithSameName = await DB_COLLECTION.item
          .query(Q.where('item_name', item.itemName!))
          .extend(Q.where('shopId', SHOPID))
          .fetch();

        if (existingItemWithSameName.length > 0) {
          Toast.error('Item already exists');
          return;
        }

        const idx = item.idx ? item.idx : idxGenerator();

        const newItem = await DB_COLLECTION.item.create((c) => {
          c._raw.id = idx;
          c.itemName = item.itemName || '';
          c.sellingPrice = Number(item.sellingPrice);
          c.costPrice = Number(item?.costPrice);
          c.isActive = item.isActive !== undefined ? item.isActive : true;
          c.isStockEnabled = item.isStockEnabled || false;
          c.openingStock = item.openingStock || 0;
          c.measurementUnit = item.measurementUnit || '';
          c.shopId = SHOPID;
          c.currentStock = item.currentStock || 0;
          c.lowStockAlert = item.lowStockAlert || 0;
        });

        return responseHandler({
          message: 'Item is created',
          statusCode: 201,
          data: newItem,
        });
      })
      .catch((error) => {
        throw error;
      });
  },
};
