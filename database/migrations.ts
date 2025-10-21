// migrations.ts
import {
  addColumns,
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: "customer",
          columns: [{ name: "idx", type: "string" }],
        }),
        addColumns({
          table: "item",
          columns: [{ name: "idx", type: "string" }],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        createTable({
          name: "sales",
          columns: [
            { name: "invoiceNumber", type: "string" },
            { name: "shopId", type: "string" },
            { name: "grandTotalAmount", type: "number" },
            { name: "paymentType", type: "string" },
            { name: "status", type: "string" },
            { name: "discountAmount", type: "number" },
            { name: "taxAmount", type: "number" },
            { name: "subTotalAmount", type: "number" },
            { name: "additionalAmount", type: "number" },
            { name: "oldDueAmount", type: "number" },
            { name: "dueAmount", type: "number" },
            { name: "paidAmount", type: "number" },
            { name: "remarks", type: "string" },
            { name: "invoiceDate", type: "number" },
            { name: "createdAt", type: "number" },
            { name: "updatedAt", type: "number" },
          ],
        }),
        createTable({
          name: "salesitem",
          columns: [
            { name: "salesId", type: "string", isIndexed: true },
            { name: "itemId", type: "string" },
            { name: "quantity", type: "number" },
            { name: "price", type: "number" },
            { name: "discountAmount", type: "number" },
            { name: "createdAt", type: "number" },
            { name: "updatedAt", type: "number" },
            { name: "itemName", type: "string" },
          ],
        }),
      ],
    },
    // {
    //   toVersion: 7,
    //   steps: [
    //     createTable({
    //       name: "paymentaccount",
    //       columns: [
    //         { name: "balance", type: "number" },
    //         { name: "isActive", type: "boolean" },
    //         { name: "shopId", type: "string" },
    //         { name: "name", type: "string" },
    //         { name: "createdAt", type: "number" },
    //         { name: "updatedAt", type: "number" },
    //       ],
    //     }),
    //   ],
    // },
  ],
});
