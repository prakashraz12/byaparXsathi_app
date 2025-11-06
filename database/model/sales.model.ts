import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { SCHEMA_KEYS } from '../shema.keys';

export default class Sales extends Model {
  static table = SCHEMA_KEYS.SALES;

  @field('invoiceNumber') invoiceNumber?: string;
  @field('shopId') shopId?: string;
  @field('grandTotalAmount') grandTotalAmount?: number;
  @field('paymentType') paymentType?: string | null;
  @field('status') status?: string | null;
  @field('discountAmount') discountAmount?: number;
  @field('taxAmount') taxAmount?: number;
  @field('subTotalAmount') subTotalAmount?: number;
  @field('additionalAmount') additionalAmount?: number;
  @field('oldDueAmount') oldDueAmount?: number;
  @field('dueAmount') dueAmount?: number;
  @field('paidAmount') paidAmount?: number;
  @field('remarks') remarks?: string;
  @field('invoiceDate') invoiceDate?: number;
  @field('customerId') customerId?: string;
  @field('customerName') customerName?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
  @field('payableAmount') payableAmount?: number;
  @field('amountDeducted') amountDeducted?: number;
}
