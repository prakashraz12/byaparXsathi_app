import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Header } from "@/components/re-usables/header";
import { salesService } from "@/database/services/sales.service";
import PXWrapper from "@/layouts/px-wrapper";
import ThermalBill from "@/components/sales/thermal-bill";
import Shop from "@/database/model/shop.model";
import SalesItem from "@/database/model/sales-item.model";
import { router } from "expo-router";
import { Text } from "@/components/re-usables/text";
import { Download, Pen, Printer, Share2, Trash } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import { generatePDF } from "@/components/sales/printable-sales-invoice";
import AlertModal from "@/components/re-usables/modal/alert-modal";

interface SingleSalesScreenProps {
  id: string;
}

const SingleSalesScreen = ({ id }: SingleSalesScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [shopInfo, setShopInfo] = useState<Shop | null>(null);
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [customerName, setCustomerName] = useState<string>("");

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const fetchSales = async () => {
    try {
      const { data } = await salesService.getSalesById(id);
      if (data) {
        setSalesData(data?.sale);
        setShopInfo(data?.shop);
        setSalesItems(data?.salesItems);
        setCustomerName(data?.sale?.customerName);
      }
    } catch (error) {
      console.error("Error fetching sale data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    salesService.deleteSalesById(id);
    setIsDeleteModalVisible(false);
    router.back();
  };

  useEffect(() => {
    fetchSales();
  }, [id]);


  if (loading) {
    return (
      <PXWrapper header={<Header title="Sale" />}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </PXWrapper>
    );
  }

  return (
    <PXWrapper
      backgroundColor="#ffffff"
      header={
        <Header
          title="Sale"
          rightComponent={
            <View
              style={{ flexDirection: "row", gap: 18, alignItems: "center" }}
            >
              <TouchableOpacity onPress={()=>router.push(`/sales/edit/${id}`)}>
                <Pen size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
                <Trash size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          }
          onBackPress={() => router.back()}
        />
      }
      footer={
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flex: 1,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: "#3b82f6",
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Printer size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              Print
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flex: 1,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: "#10b981",
              shadowColor: "#10b981",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Share2 size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flex: 1,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: "#f59e0b",
              shadowColor: "#f59e0b",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
            onPress={() => {
              generatePDF({
                SALES: salesData,
                salesItems: salesItems,
                shopData: shopInfo || {},
              });
              console.log("this sis ");
            }}
          >
            <Download size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.container}>
        {salesData && shopInfo && (
          <ThermalBill
            invoiceNumber={salesData.invoiceNumber}
            date={salesData.invoiceDate}
            shop={shopInfo}
            customer={salesData.customerName}
            salesItems={salesItems}
            paymentType={salesData.paymentType}
            subtotal={salesData.subTotalAmount}
            tax={salesData.taxAmount}
            cumulativeDiscount={salesData.discountAmount}
            additionalCharges={salesData.additionalAmount}
            remarks={salesData.remarks}
            paidAmount={salesData.paidAmount}

          />
        )}
      </View>
      <AlertModal
        type="danger"
        visible={isDeleteModalVisible}
        message="Are you sure you want to delete this sale?"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default SingleSalesScreen;
