import SingleSalesScreen from "@/screen/sales/single-sales.screen";
import { useLocalSearchParams, useRouter } from "expo-router";

const SingleSales = () => {
    const {id} = useLocalSearchParams();
    return (
    <SingleSalesScreen id={id as string}/>   
    );
};
export default SingleSales;