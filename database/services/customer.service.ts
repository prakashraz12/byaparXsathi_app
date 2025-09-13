import { DB_COLLECTION } from "../collection"
import database from "../index"
import Customer from "../model/customer.model"

export const customerService = {
  create: async (data: Partial<Customer>) => {
    return database.write(async () => {
      const customer = await DB_COLLECTION.customer.create((c) => {
        c.name = data.name!
        c.email = data.email || ''
        c.phone = data.phone || ''
        c.address = data.address || ''
        c.outstanding = data.outstanding || 0
        c.available_credit = data.available_credit || 0
        c.status = data.status || 'active'
        c.created_at = Date.now()
        c.updated_at = Date.now()
      })
      return customer;
    })
  },

  getAll: async () => {
    return DB_COLLECTION.customer.query().fetch()
  },

  update: async (id: string, data: Partial<Customer>) => {
    const customer = await DB_COLLECTION.customer.find(id)
    return database.write(async () => {
      return customer.update((c) => {
        if (data.name) c.name = data.name
        if (data.email) c.email = data.email
        if (data.phone) c.phone = data.phone
        if (data.address) c.address = data.address
        c.updated_at = Date.now()
      })
    })
  },

  delete: async (id: string) => {
    const customer = await DB_COLLECTION.customer.find(id)
    return database.write(async () => {
      await customer.markAsDeleted()
    })
  },
}
