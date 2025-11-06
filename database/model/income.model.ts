import { Model } from '@nozbe/watermelondb';
import { SCHEMA_KEYS } from '../shema.keys';
import { field } from '@nozbe/watermelondb/decorators';

export default class Income extends Model {
  static table = SCHEMA_KEYS.INCOME;

  @field('amount') amount?: number;
  @field('incomeSource') incomeSource?: string;
  @field('remarks') remarks?: string;
  @field('shopId') shopId?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
}
