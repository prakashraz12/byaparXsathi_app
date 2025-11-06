import { Model } from '@nozbe/watermelondb';
import { SCHEMA_KEYS } from '../shema.keys';
import { field, text } from '@nozbe/watermelondb/decorators';

export class Activity extends Model {
  static table = SCHEMA_KEYS.ACTIVITY;

  @text('title') title?: string;
  @text('description') description?: string;
  @text('type') type?: string;
  @field('created_at') created_at?: number;
  @field('updated_at') updated_at?: number;
  @field('shopId') shopId?: string;
  @field('platform') platform?: string;
}
