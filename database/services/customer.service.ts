import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { DB_COLLECTION } from "../collection";
import database from "../index";
import Customer from "../model/customer.model";
import { Q } from "@nozbe/watermelondb";
import { idxGenerator } from "@/utils/idx.utils";
import Sales from "../model/sales.model";

export const customerService = {
  create: async (data: Partial<Customer> & { id?: string }) => {
    if (!data.phone || !data.name || !data.address || !data?.shopId) return;

    return database.write(async () => {
      // check if a customer already exists with this phone
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
  // salesUpdate: async (id: string, data: Partial<Sales>) => {
  //  try {

  //    const sale = await DB_COLLECTION.sales.find(id);

  //      return database.write(async()=>{
  //          sale.update((s)=>{
  //            s.remarks = data.remarks;
  //           s.updatedAt = new Date();
  //           s.invoiceNumber = "sldnsadnasd"
  //           s.shopId = "asdsadasdas"
  //           s.grandTotalAmount = 1345666
  //           s.paymentType = "cash"
  //           s.status = "PAID"
  //           s.discountAmount = 12000
  //           s.taxAmount = 12000
  //           s.subTotalAmount = 12000
  //           s.additionalAmount = 12000
  //           s.oldDueAmount = 12000
  //           s.dueAmount = 12000
  //           s.paidAmount = 12000
  //           s.invoiceDate = Date.now()
        

  //       console.log("Update completed");
  //       return sale;
  //         })
  //      })
  //  } catch (error) {
    
  //  }
  // }
  salesUpdate: async (id: string, data: Partial<Sales>) => {
  try {
    console.log("salesUpdate called with id:", id);
    
    return await database.write(async () => {
      // Fetch inside the write block
      const sales = await DB_COLLECTION.sales.find(id);
      console.log("Found sales:", sales);
      console.log("Sales table:", sales.table);
      console.log("Sales update function:", typeof sales.update);
      
      await sales.update((s) => {
        console.log(s, "kando")
      });
      return sales;
    });
  } catch (error) {
    console.log("Error in salesUpdate:", error);
    throw error; // Re-throw to see the full error
  }
},
}
