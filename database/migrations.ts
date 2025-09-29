// migrations.ts
import { tableSchema } from "@nozbe/watermelondb";
import {
  schemaMigrations,
  createTable,
  addColumns,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 4, 
      steps: [
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'items',
            columns: [
              { name: 'item_name', type: 'string', isIndexed:true },
              { name: 'cost_price', type: 'number' },
              { name: 'selling_price', type: 'number' },
              { name: 'measurement_unit', type: 'string', isOptional: true },
              { name: 'shop_idx', type: 'string', isIndexed: true },
              { name: 'opening_stock', type: 'number' },
              { name: 'current_stock', type: 'number' },
              { name: 'low_stock_alert', type: 'number' },
              { name: 'is_stock_enabled', type: 'boolean' },
              { name: 'is_active', type: 'boolean' },
              { name: 'image_url', type: 'string', isOptional: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
      ],
    },
    
  ],
});
