import HHeader from "@/components/re-usables/h-header";
import CustomInput from "@/components/re-usables/input";
import database from "@/database";
import PXWrapper from "@/layouts/px-wrapper";
import { useSalesControllerGetAllSales } from "@/service/queries-components";
import { Search } from "lucide-react-native";
import { Button, Pressable, Text, View } from "react-native";
import type Customer from "@/database/model/customer.model";

const SalesScreen = () => {
  const {data} = useSalesControllerGetAllSales({
   queryParams:{
    page:1,
    shopId:4,
    size:10
   },
   
  });

  async function fetchCustomers() {
    const customers = await database.get<Customer>('customer').query().fetch()
    console.log(customers.map(c => c.name))
  }
  
  const handleAddCustomer = async()=>{
    const cs = database.get("customer");

    await database.write(async () => {
      await cs.create((customer:Customer) => {
        customer.name = "John Doe";
        customer.email = "john.doe@example.com";
        customer.phone = 1234567890;
        customer.address = "123 Main St";
        customer.created_at = Date.now();
        customer.updated_at = Date.now();
      });
    });
  }
  return (
    <PXWrapper
      header={
        <>
          <HHeader title="Sales" />
          <View>
            <CustomInput placeholder="Enter Sales" leftIcon={<Search />} />
          </View>
        </>
      }
    >
      <>
    <Button title="Add customer" onPress={handleAddCustomer}/>
    <Button title="Fetch Customer" onPress={fetchCustomers} />
      </>
    </PXWrapper>
  );
};
export default SalesScreen;
