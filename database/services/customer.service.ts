import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { DB_COLLECTION } from "../collection";
import database from "../index";
import Customer from "../model/customer.model";
import { Q } from "@nozbe/watermelondb";
import { idxGenerator } from "@/utils/idx.utils";
import Sales from "../model/sales.model";
import PaymentIn from "../model/paymentIn.model";

export const customerService = {
  create: async (data: Partial<Customer> & { id?: string }) => {
    if (!data.phone || !data.name || !data.address || !data?.shopId) return;

    return database.write(async () => {
      const existingUser = await DB_COLLECTION.customer
        .query(Q.where("phone", data?.phone?.toString()!))
        .extend(Q.where("shopId", data?.shopId!))
        .fetch();

      if (existingUser.length > 0) {
        Toast.error("Customer already exists");
        return;
      }

      const id = data?.id || idxGenerator();
      const customer = await DB_COLLECTION.customer.create((c) => {
        c._raw.id = id;
        c.name = data.name!;
        c.email = data.email || "";
        c.phone = data.phone || "";
        c.address = data.address || "";
        c.outstanding = data.outstanding || 0;
        c.available_credit = data.available_credit || 0;
        c.status = data.status || "active";
        c.created_at = Date.now();
        c.updated_at = Date.now();
        c.shopId = data.shopId;
      });

      return {
        customer,
        message: "Customer created successfully",
        status: 201,
        success: true,
      };
    });
  },

  getAll: async () => {
    return DB_COLLECTION.customer.query().fetch();
  },

  update: async (id: string, data: Partial<Customer> & { idx?: string }) => {
    const customer = await DB_COLLECTION.customer.find(id);
    return database.write(async () => {
      return customer.update((c) => {
        if (data.name) c.name = data.name;
        if (data.email) c.email = data.email;
        if (data.phone) c.phone = data.phone;
        if (data.address) c.address = data.address;
        c.updated_at = Date.now();
      });
    });
  },

  delete: async (id: string) => {
    const customer = await DB_COLLECTION.customer.find(id);
    return database.write(async () => {
      await customer.markAsDeleted();
    });
  },
  getCustomerById: async (id: string) => {
    if (!id) return;
    const customer = await DB_COLLECTION.customer.findAndObserve(id);
    if (!customer) {
      Toast.error("Customer not found");
      return;
    }
    return customer;
  },
  addPaymentIn: async (data: Partial<PaymentIn>) => {
    if (!data.customerId || !data.amount || !data.shopId) return;
    return database.write(async () => {
      const findCustomer = await DB_COLLECTION.customer.find(data?.customerId!);
      if (!findCustomer) {
        Toast.error("Customer not found");
        return;
      }

      const id = idxGenerator();
      const paymentIn = await DB_COLLECTION.paymentIn.create((p) => {
        p._raw.id = id;
        p.customerId = data.customerId!;
        p.amount = data.amount;
        p.shopId = data.shopId;
        p.paymentInDate = data.paymentInDate;
        p.paymentId = data.paymentId;
        p.created_at = new Date().getTime();
        p.updated_at = new Date().getTime();
      });

      if (Number(findCustomer?.outstanding) >= Number(data?.amount)) {
        const extraAmount =
          Number(findCustomer?.outstanding) - Number(data?.amount);
        findCustomer.update((c) => {
          c.outstanding = 0;
          c.updated_at = new Date().getTime();
          c.available_credit =
            Number(findCustomer?.available_credit) + extraAmount;
        });
      } else {
        findCustomer.update((c) => {
          c.outstanding =
            Number(findCustomer?.outstanding) - Number(data?.amount);
          c.updated_at = new Date().getTime();
        });
      }

      return {
        paymentIn,
        message: "Payment added successfully",
        status: 201,
        success: true,
      };
    });
  },
};
