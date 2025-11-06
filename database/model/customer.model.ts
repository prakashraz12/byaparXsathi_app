import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { SCHEMA_KEYS } from '../shema.keys';

export default class Customer extends Model {
  static table = SCHEMA_KEYS.CUSTOMER;

  @text('name') name?: string;
  @text('email') email?: string;
  @field('phone') phone?: string;
  @text('address') address?: string;
  @field('outstanding') outstanding?: number;
  @field('available_credit') available_credit?: number;
  @field('status') status?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
  @field('shopId') shopId?: string;
}
