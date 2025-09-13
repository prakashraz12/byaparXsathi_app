import { appSchema, tableSchema } from '@nozbe/watermelondb'
import { SCHEMA_KEYS } from '../shema.keys'

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: SCHEMA_KEYS.CUSTOMER,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'outstanding', type: 'number' },
        { name: 'available_credit', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ]
})