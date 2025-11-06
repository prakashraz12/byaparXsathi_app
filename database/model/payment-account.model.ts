import { Model } from '@nozbe/watermelondb';
import { field, writer } from '@nozbe/watermelondb/decorators';
import { SCHEMA_KEYS } from '../shema.keys';

export default class PaymentAccount extends Model {
  static table = SCHEMA_KEYS.PAYMENT_ACCOUNT;

  @field('balance') balance?: number;
  @field('isActive') isActive?: boolean;
  @field('shopId') shopId?: string;
  @field('name') name?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
}
