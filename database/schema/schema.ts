import { appSchema, tableSchema } from "@nozbe/watermelondb";
import { SCHEMA_KEYS } from "../shema.keys";

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: SCHEMA_KEYS.CUSTOMER,
      columns: [
        { name: "name", type: "string" },
        { name: "email", type: "string" },
        { name: "phone", type: "string" },
        { name: "address", type: "string" },
        { name: "outstanding", type: "number" },
        { name: "available_credit", type: "number" },
        { name: "status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "shop_idx", type: "string" },
      ],
    }),
    tableSchema({
      name: SCHEMA_KEYS.SHOP,
      columns: [
        { name: "shopName", type: "string" },
        { name: "idx", type: "string", isIndexed: true },
        { name: "shopEmail", type: "string" },
        { name: "shopPhoneNumber", type: "string" },
        { name: "address", type: "string" },
        { name: "panNumber", type: "string" },
        { name: "registrationNumber", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "shopType", type: "string" },
        { name: "shopPanNumber", type: "string" },
        { name: "measuringUnits", type: "string" },
        { name: "userId", type: "string" },
      ],
    }),
    tableSchema({
      name: SCHEMA_KEYS.ITEM,
      columns: [
        { name: 'item_name', type: 'string' },
        { name: 'cost_price', type: 'number' },
        { name: 'selling_price', type: 'number' },
        { name: 'measurement_unit', type: 'string', isOptional: true },
        { name: 'shop_idx', type: 'string' },
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
  ],
});
