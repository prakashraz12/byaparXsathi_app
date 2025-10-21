import { Model } from "@nozbe/watermelondb";
import { SCHEMA_KEYS } from "../shema.keys";
import { children, field } from "@nozbe/watermelondb/decorators";

export default class Sales extends Model {
    static table = SCHEMA_KEYS.SALES;
    static associations = {
      [SCHEMA_KEYS.SALES_ITEM]: { type: 'has_many', foreignKey: 'salesId' },
    } as const;
  
    @field("invoiceNumber") invoiceNumber?: string;
    @field("shopId") shopId?: string;
    @field("grandTotalAmount") grandTotalAmount?: number;
    @field("paymentType") paymentType?: string | null;
    @field("status") status?: string | null;
    @field("discountAmount") discountAmount?: number;
    @field("taxAmount") taxAmount?: number;
    @field("subTotalAmount") subTotalAmount?: number;
    @field("additionalAmount") additionalAmount?: number;
    @field("oldDueAmount") oldDueAmount?: number;
    @field("dueAmount") dueAmount?: number;
    @field("paidAmount") paidAmount?: number;
    @field("remarks") remarks?: string;
    @field("invoiceDate") invoiceDate?: number;
    @field("createdAt") createdAt?: Date;
    @field("updatedAt") updatedAt?: Date;
    @children(SCHEMA_KEYS.SALES_ITEM) salesItems!: any;

  }
  