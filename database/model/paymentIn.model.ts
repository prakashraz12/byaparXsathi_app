import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { SCHEMA_KEYS } from '../shema.keys';

export default class PaymentIn extends Model {
  static table = SCHEMA_KEYS.PAYMENT_IN;

  @field('paymentId') paymentId?: string;
  @field('amount') amount?: number;
  @field('remarks') remarks?: string;
  @field('shopId') shopId?: string;
  @field('customerId') customerId?: string;
  @field('paymentInDate') paymentInDate?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
  @field('receiptNumber') receiptNumber?: string;
}
