"use client";

import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Share,
} from "react-native";
import { Header } from "@/components/re-usables/header";
import { salesService } from "@/database/services/sales.service";
import PXWrapper from "@/layouts/px-wrapper";
import ThermalBill from "@/components/sales/thermal-bill";
import Shop from "@/database/model/shop.model";
import SalesItem from "@/database/model/sales-item.model";
import { router } from "expo-router";
import { Text } from "@/components/re-usables/text";
import { Download, Pen, Printer, Share2, ShareIcon, Trash } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";

interface SingleSalesScreenProps {
  id: string;
}

// Dummy data for demonstration
const DUMMY_SHOP = {
  name: "ABC Electronics Store",
  phone: "+91-9876543210",
  address: "123 Market Street",
  city: "Mumbai",
  state: "Maharashtra",
};

const DUMMY_CUSTOMER = {
  name: "John Doe",
  phone: "+91-9123456789",
  address: "456 Residential Area",
};

const DUMMY_SALES_ITEMS = [
  {
    id: "1",
    name: "Laptop",
    quantity: 1,
    unitPrice: 45000,
    amount: 45000,
    discount: 2000,
  },
  {
    id: "2",
    name: "Mouse",
    quantity: 2,
    unitPrice: 500,
    amount: 1000,
    discount: 0,
  },
  {
    id: "3",
    name: "USB Cable",
    quantity: 5,
    unitPrice: 200,
    amount: 1000,
    discount: 100,
  },
];

const SingleSalesScreen = ({ id }: SingleSalesScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [shopInfo, setShopInfo] = useState<Shop | null>(null);
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);

  const fetchSales = async () => {
    try {
      const { data } = await salesService.getSalesById(id);
      if (data) {
        setSalesData(data?.sale);
        setShopInfo(data?.shop);
        setSalesItems(data?.salesItems);
      }
    } catch (error) {
      console.error("Error fetching sale data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [id]);

  if (loading) {
    return (
      <PXWrapper header={<Header title="Sale" />}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </PXWrapper>
    );
  }


  return (
    <PXWrapper
      header={
        <Header
          title="Sale"
          rightComponent={
            <View
              style={{ flexDirection: "row", gap: 18, alignItems: "center" }}
            >
              <TouchableOpacity>
                <Pen size={20} />
              </TouchableOpacity>
              <TouchableOpacity>
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
              justifyContent:"center",
              gap: 8,
              flex:1,
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
              justifyContent:"center",
              gap: 8,
              flex:1,
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
              justifyContent:"center",
              gap: 8,
              flex:1,
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
          >
            <Download size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView style={styles.container}>
        {salesData && shopInfo && (
          <ThermalBill
            invoiceNumber={salesData.invoiceNumber}
            date={salesData.invoiceDate}
            shop={shopInfo}
            customer={salesData.customer}
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
      </ScrollView>
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SingleSalesScreen;
